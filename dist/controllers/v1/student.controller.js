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
exports.remove = exports.update = exports.create = exports.index = void 0;
const prisma_config_1 = __importDefault(require("../../config/prisma.config"));
const middleware_1 = require("../../config/middleware");
const { verifyToken } = (0, middleware_1.useMiddleware)();
/**
 * Get all students
 * @route GET /api/v1/students
 * @param req
 * @param res
 * @returns
 */
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const branch_uuid = req.headers['x-branch-session'];
    const token = req.headers.authorization || null;
    verifyToken(token, res);
    if (!branch_uuid) {
        res.status(400).json({
            status: 400,
            success: false,
            message: 'Unauthorized',
        });
        return;
    }
    const students = yield prisma_config_1.default.student.findMany({
        where: {
            branch_uuid,
        },
        include: {
            parent: true,
            class: true,
        },
    });
    res.status(200).json({
        status: 200,
        success: true,
        message: 'Students',
        data: { students },
    });
});
exports.index = index;
/**
 * Create a new student
 * @param req
 * @param res
 * @returns
 */
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, reg_number, parent_uuid, class_uuid } = req.body;
    const token = req.headers.authorization || null;
    const decoded = verifyToken(token, res);
    if (decoded.role != 'ADMIN') {
        res.status(400).json({
            status: 400,
            success: false,
            message: 'Unauthorized',
        });
        return;
    }
    if (!name || !parent_uuid || !class_uuid || !reg_number) {
        res.status(422).json({
            status: 422,
            success: false,
            message: 'Name, Parent, class and Registration number are required',
        });
        return;
    }
    const branch_uuid = req.headers['x-branch-session'];
    if (!branch_uuid) {
        res.status(400).json({
            status: 400,
            success: false,
            message: 'Unauthorized',
        });
        return;
    }
    const existingReg = yield prisma_config_1.default.student.findUnique({
        where: {
            branch_uuid_reg_number: {
                branch_uuid,
                reg_number,
            },
        },
    });
    if (existingReg) {
        res.status(400).json({
            status: 400,
            success: false,
            message: 'Registration number already taken',
        });
        return;
    }
    const result = yield prisma_config_1.default.student.create({
        data: {
            name,
            reg_number,
            parent_uuid,
            branch_uuid,
            class_uuid,
        },
    });
    res.status(201).json({
        status: 201,
        success: true,
        message: 'Student created',
        data: { student: result },
    });
});
exports.create = create;
/**
 * Get a student by ID
 * @param req
 * @param res
 * @returns
 */
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uuid } = req.params;
    const { name, reg_number, parent_uuid, class_uuid } = req.body;
    const token = req.headers.authorization || null;
    const decoded = verifyToken(token, res);
    if (decoded.role != 'ADMIN') {
        res.status(400).json({
            status: 400,
            success: false,
            message: 'Unauthorized',
        });
        return;
    }
    if (!name || !parent_uuid || !class_uuid || !reg_number) {
        res.status(422).json({
            status: 422,
            success: false,
            message: 'Name, Parent, class and Registration number are required',
        });
        return;
    }
    const branch_uuid = req.headers['x-branch-session'];
    if (!branch_uuid) {
        res.status(400).json({
            status: 400,
            success: false,
            message: 'Unauthorized',
        });
        return;
    }
    const existingReg = yield prisma_config_1.default.student.findUnique({
        where: {
            branch_uuid_reg_number: {
                branch_uuid,
                reg_number,
            },
        },
    });
    if (existingReg && existingReg.uuid !== uuid) {
        res.status(400).json({
            status: 400,
            success: false,
            message: 'Registration number already taken',
        });
        return;
    }
    const result = yield prisma_config_1.default.student.update({
        where: { uuid },
        data: {
            name,
            reg_number,
            parent_uuid,
            class_uuid,
        },
    });
    res.status(200).json({
        status: 200,
        success: true,
        message: 'Student updated',
        data: { student: result },
    });
});
exports.update = update;
/**
 * Delete a student
 * @param req
 * @param res
 * @returns
 */
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uuid } = req.params;
    const token = req.headers.authorization || null;
    const decoded = verifyToken(token, res);
    if (decoded.role != 'ADMIN') {
        res.status(400).json({
            status: 400,
            success: false,
            message: 'Unauthorized',
        });
        return;
    }
    const branch_uuid = req.headers['x-branch-session'];
    if (!branch_uuid) {
        res.status(400).json({
            status: 400,
            success: false,
            message: 'Unauthorized',
        });
        return;
    }
    try {
        const student = yield prisma_config_1.default.student.findUnique({
            where: { uuid: uuid },
        });
        if (!student) {
            res.status(404).json({
                status: 404,
                success: false,
                message: 'Student not found',
            });
            return;
        }
        yield prisma_config_1.default.result.deleteMany({
            where: { student_uuid: uuid },
        });
        yield prisma_config_1.default.student.delete({
            where: { uuid: uuid },
        });
        res.status(200).json({
            status: 200,
            success: true,
            message: 'Student deleted',
        });
    }
    catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: 'Internal server error',
        });
        return;
    }
});
exports.remove = remove;
