import { Role } from '@prisma/client';

export type DecodedUser = {
  uuid: string;
  role: Role;
  email: string;
  position: string;
  school_uuid: string;
};
