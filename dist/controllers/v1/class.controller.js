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
exports.remove = exports.update = exports.show = exports.create = exports.index = void 0;
const prisma_config_1 = __importDefault(require("../../config/prisma.config"));
const middleware_1 = require("../../config/middleware");
const { verifyToken } = (0, middleware_1.useMiddleware)();
/**
 * @desc Get all classes
 * @route GET /api/v1/branch/:branch_uuid/classes
 * @access Public
 */
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const branch = req.headers['x-branch-session'];
    const token = req.headers.authorization || null;
    verifyToken(token, res);
    if (branch) {
        const branch_uuid = branch;
        try {
            let classes = yield prisma_config_1.default.class.findMany({
                where: {
                    branch_uuid,
                },
                include: {
                    students: true,
                },
                orderBy: {
                    created_at: 'asc',
                },
            });
            const classesWithStudentCount = classes.map((cls) => (Object.assign(Object.assign({}, cls), { studentCount: cls.students.length })));
            classes = classesWithStudentCount;
            res.status(200).json({
                status: 200,
                success: true,
                message: 'Classes retrieved successfully',
                data: { classes },
            });
        }
        catch (error) {
            res.status(400).json({
                status: 400,
                success: false,
                message: error.message,
            });
            return;
        }
    }
    else {
        res.status(400).json({
            status: 400,
            success: false,
            message: 'Unauthorized',
        });
        return;
    }
});
exports.index = index;
/**
 * @desc Create a new class
 * @route POST /api/v1/schools/:school_uuid/classes
 * @access Public
 */
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const branch = req.headers['x-branch-session'];
    const { name, capacity, teacher_uuid } = req.body;
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
    if (branch && name) {
        const branch_uuid = branch;
        try {
            const result = yield prisma_config_1.default.class.create({
                data: {
                    name,
                    capacity,
                    branch_uuid,
                    teacher_uuid,
                },
            });
            res.status(201).json({
                status: 201,
                success: true,
                message: 'Class created successfully',
                data: { class: result },
            });
        }
        catch (error) {
            res.status(400).json({
                status: 400,
                success: false,
                message: error.message,
            });
            return;
        }
    }
    else {
        res.status(400).json({
            status: 400,
            success: false,
            message: 'School UUID and class name are required',
        });
        return;
    }
});
exports.create = create;
/**
 * Show a class
 * @description This function retrieves a class from the database.
 * @route GET /api/v1/schools/:school_uuid/classes/:class_uuid
 * @param req
 * @param res
 * @returns
 */
const show = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uuid } = req.params;
    const token = req.headers.authorization || null;
    verifyToken(token, res);
    if (uuid) {
        try {
            const classData = yield prisma_config_1.default.class.findUnique({
                where: {
                    uuid,
                },
                include: {
                    teacher: true,
                    students: true,
                },
            });
            if (!classData) {
                res.status(404).json({
                    status: 404,
                    success: false,
                    message: 'Class not found',
                });
                return;
            }
            res.status(200).json({
                status: 200,
                success: true,
                message: 'Class retrieved successfully',
                data: { class: classData },
            });
        }
        catch (error) {
            res.status(400).json({
                status: 400,
                success: false,
                message: error.message,
            });
            return;
        }
    }
    else {
        res.status(400).json({
            status: 400,
            success: false,
            message: 'School UUID and class UUID are required',
        });
        return;
    }
});
exports.show = show;
/**
 * Update class
 * @param req
 * @param res
 */
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uuid } = req.params;
    const { name, capacity, teacher_uuid } = req.body;
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
    try {
        const updatedClass = yield prisma_config_1.default.class.update({
            where: { uuid },
            data: {
                name,
                capacity,
                teacher_uuid,
            },
        });
        if (!updatedClass) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: 'Class not found',
            });
        }
        res.status(200).json({
            status: 200,
            success: true,
            message: 'Class updated successfully',
            data: { class: updatedClass },
        });
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
exports.update = update;
/**
 * Delete class
 * @param req
 * @param res
 */
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization || null;
    const { uuid } = req.params;
    const decoded = verifyToken(token, res);
    if (decoded.role != 'ADMIN') {
        res.status(400).json({
            status: 400,
            success: false,
            message: 'Unauthorized',
        });
        return;
    }
    try {
        const classWithStudents = yield prisma_config_1.default.class.findUnique({
            where: { uuid },
            include: { students: true },
        });
        if (!classWithStudents) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: 'Class not found',
            });
        }
        if (classWithStudents && classWithStudents.students.length > 0) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: 'Cannot delete class with students enrolled',
            });
        }
        yield prisma_config_1.default.class.delete({
            where: { uuid },
        });
        res.status(200).json({
            status: 200,
            success: true,
            message: 'Class deleted successfully',
        });
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
exports.remove = remove;
