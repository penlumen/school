import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { PrismaService } from '../prisma/prisma.service.js';
import { HashingService } from '../common/hashing.service.js';
import { DecodedUser } from '../common/types/auth.js';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashing: HashingService,
  ) {}

  generateToken(user: Partial<DecodedUser> & { uuid: string }): string {
    return jwt.sign(
      {
        uuid: user.uuid,
        role: (user as any).role,
        email: (user as any).email,
        position: (user as any).position,
        school_uuid: (user as any).school_uuid,
      },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '1d' },
    );
  }

  async checkSchoolToken(token: string) {
    const school = await this.prisma.school.findUnique({ where: { token } });
    return school ?? null;
  }

  async register(body: {
    name?: string;
    role?: string;
    email?: string;
    password?: string;
  }) {
    const { name, role, email, password } = body;

    if (!email || !password || !role) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Email, password and role are required',
      });
    }

    const existingSchool = await this.prisma.school.findUnique({
      where: { email },
    });
    if (existingSchool) {
      throw new ConflictException({
        status: 409,
        success: false,
        message: 'Email already exists',
      });
    }

    const hashPassword = await this.hashing.createHash(password);

    const result = await this.prisma.$transaction(async (tx) => {
      // 1. Generate unique school slug
      let generatedName = email.split('@')[0];
      let nameToCheck = generatedName;
      let counter = 1;

      while (
        await tx.school.findUnique({
          where: { slug: nameToCheck },
        })
      ) {
        nameToCheck = `${generatedName}${counter}`;
        counter++;
      }

      generatedName = nameToCheck;

      // 2. Create school first
      const school = await tx.school.create({
        data: {
          email,
          slug: generatedName,
          name: generatedName,
        },
      });

      // 3. Create default branch
      const branch = await tx.branch.create({
        data: {
          school_uuid: school.uuid,
          name: school.name,
        },
      });

      // 4. Create school owner
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashPassword,
          school_uuid: school.uuid,
          position: 'ADMINISTRATIVE',
          role: 'ADMIN',
        },
      });

      // 5. Give owner access to the branch
      await tx.branchAccess.create({
        data: {
          role: user.role,
          user_uuid: user.uuid,
          school_uuid: school.uuid,
          branch_uuid: branch.uuid,
        },
      });

      return { user, school, branch };
    });

    const { user, school } = result;
    const token = this.generateToken({ ...user, school_uuid: school.uuid });

    return {
      status: 201,
      success: true,
      message: 'School and Admin User created successfully',
      data: { token, user, school },
    };
  }

  async login(
    schoolToken: string | undefined,
    body: { email?: string; password?: string; role?: string },
  ) {
    if (!schoolToken) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Header SchoolToken is required',
      });
    }

    const school = await this.checkSchoolToken(schoolToken);
    if (!school) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Invalid school token',
      });
    }

    const { email, password, role } = body;
    if (!email || !password || !role) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Email, password, role are required',
      });
    }

    const upperRole = role.toUpperCase() as Role;
    const isStaff = ['ROOT', 'ADMIN', 'STAFF'].includes(upperRole);

    let user: any = null;
    if (isStaff) {
      user = await this.prisma.user.findFirst({
        where: {
          school_uuid: school.uuid,
          email,
          OR: [{ role: 'ROOT' }, { role: 'ADMIN' }, { role: 'STAFF' }],
        },
      });
    } else {
      user = await this.prisma.user.findUnique({
        where: {
          school_uuid_email_role: {
            school_uuid: school.uuid,
            role: upperRole,
            email,
          },
        },
      });
    }

    if (!user) {
      throw new UnauthorizedException({
        status: 401,
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isPasswordValid = await this.hashing.compareHash(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException({
        status: 401,
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = this.generateToken(user);

    return {
      status: 200,
      success: true,
      message: 'User logged in successfully',
      data: { token, user },
    };
  }

  async profile(decoded: DecodedUser) {
    const user = await this.prisma.user.findUnique({
      where: { uuid: decoded.uuid },
    });

    if (!user) {
      throw new NotFoundException({
        status: 404,
        success: false,
        message: 'Session terminated',
      });
    }

    return {
      status: 200,
      success: true,
      message: 'User profile retrieved successfully',
      data: user,
    };
  }
}
