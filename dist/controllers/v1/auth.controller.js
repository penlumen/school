"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profile = exports.login = exports.register = void 0;
const prisma_config_1 = __importDefault(require("../../config/prisma.config"));
const hashing_1 = require("../../config/hashing");
const middleware_1 = require("../../config/middleware");
const { createHash, compareHash } = (0, hashing_1.useHashing)();
const { generateToken, verifyToken, checkSchoolToken } = (0, middleware_1.useMiddleware)();
/**
 * Register
 * @param req
 * @param res
 */
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, role, email, password } = req.body;
    if (!email || !password || !role) {
        res.status(400).json({
            status: 400,
            success: false,
            message: 'Email, password and role are required',
        });
        return;
    }
    try {
        const existingSchool = yield prisma_config_1.default.school.findUnique({
            where: { email },
        });
        if (existingSchool) {
            res.status(409).json({
                status: 409,
                success: false,
                message: 'Email already exists',
            });
            return;
        }
        const hashPassword = yield createHash(password);
        const result = yield prisma_config_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield tx.user.create({
                data: {
                    name,
                    email,
                    password: hashPassword,
                    position: 'administrator',
                },
            });
            let generatedName = email.split('@')[0];
            let nameToCheck = generatedName;
            let counter = 1;
            while (yield tx.school.findUnique({ where: { slug: nameToCheck } })) {
                nameToCheck = `${generatedName}${counter}`;
                counter++;
            }
            generatedName = nameToCheck;
            const school = yield tx.school.create({
                data: {
                    email,
                    slug: generatedName,
                    name: generatedName,
                },
            });
            const branch = yield tx.branch.create({
                data: {
                    school_uuid: school.uuid,
                    name: school.name,
                },
            });
            yield tx.branchAccess.create({
                data: {
                    role: user.role,
                    user_uuid: user.uuid,
                    school_uuid: school.uuid,
                    branch_uuid: branch.uuid,
                },
            });
            yield tx.user.update({
                where: { uuid: user.uuid },
                data: { school_uuid: school.uuid },
            });
            return { user, school };
        }));
        const { user, school } = result;
        const token = generateToken({
            user: Object.assign(Object.assign({}, user), { school_uuid: result.school.uuid }),
        });
        res.status(201).json({
            status: 201,
            success: true,
            message: 'School and Admin User created successfully',
            data: { token, user, school },
        });
    }
    catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: error.message,
        });
    }
});
exports.register = register;
/**
 * Login
 * @param req
 * @param res
 */
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, role } = req.body;
    const schoolToken = req.headers['x-school-token'];
    if (!schoolToken) {
        res.status(400).json({
            status: 400,
            success: false,
            message: 'Header SchoolToken is required',
        });
        return;
    }
    const school = yield checkSchoolToken(schoolToken);
    if (!school) {
        res.status(400).json({
            status: 400,
            success: false,
            message: 'Invalid school token',
        });
        return;
    }
    if (!email || !password || !role) {
        res.status(400).json({
            status: 400,
            success: false,
            message: 'Email, password, role are required',
        });
        return;
    }
    try {
        let user = null;
        console.log(user);
        user = yield prisma_config_1.default.user.findUnique({
            where: {
                school_uuid_email_role: {
                    school_uuid: school.uuid,
                    role: role.toUpperCase(),
                    email,
                },
            },
        });
        if (!user) {
            res.status(401).json({
                status: 401,
                success: false,
                message: 'Invalid email or password',
            });
            return;
        }
        const isPasswordValid = yield compareHash(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({
                status: 401,
                success: false,
                message: 'Invalid email or password',
            });
            return;
        }
        const token = generateToken({ user });
        res.status(200).json({
            status: 200,
            success: true,
            message: 'User logged in successfully',
            data: { token, user },
        });
    }
    catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: error.message || 'Something went wrong',
        });
        return;
    }
});
exports.login = login;
/**
 * Profile
 * @param req
 * @param res
 * @returns
 */
const profile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization || null;
    const decoded = verifyToken(token, res);
    try {
        const user = yield prisma_config_1.default.user.findUnique({
            where: {
                uuid: decoded.uuid,
            },
        });
        if (!user) {
            res.status(404).json({
                status: 404,
                success: false,
                message: 'Session terminated',
            });
            return;
        }
        else {
            res.status(200).json({
                status: 200,
                success: true,
                message: 'User profile retrieved successfully',
                data: user,
            });
        }
    }
    catch (error) {
        res.status(400).json({
            status: 400,
            success: false,
            message: error.message,
        });
        return;
    }
});
exports.profile = profile;
