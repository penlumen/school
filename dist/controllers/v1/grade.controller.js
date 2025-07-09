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
 * Get all grades
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
    const grades = yield prisma_config_1.default.grade.findMany({
        where: {
            branch_uuid,
        },
        orderBy: {
            score: 'desc',
        },
    });
    res.status(200).json({
        status: 200,
        success: true,
        message: 'Grades',
        data: { grades },
    });
});
exports.index = index;
/**
 * Create a new grade
 * @route POST /api/v1/grades
 * @param req
 * @param res
 * @returns
 */
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { score, grade, remark, description } = req.body;
    const token = req.headers.authorization || null;
    const decoded = verifyToken(token, res);
    if (!score || !grade || !remark) {
        res.status(422).json({
            status: 422,
            success: false,
            message: 'Score, Grade and Remark are required',
        });
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
    const result = yield prisma_config_1.default.grade.create({
        data: {
            branch_uuid,
            grade,
            score,
            remark,
            description,
        },
    });
    res.status(201).json({
        status: 201,
        success: true,
        message: 'Grade created',
        data: { grade: result },
    });
});
exports.create = create;
/**
 * Update a grade
 * @route PUT /api/v1/grades/:id
 * @param req
 * @param res
 * @returns
 */
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uuid } = req.params;
    const { score, grade, remark, description } = req.body;
    const token = req.headers.authorization || null;
    verifyToken(token, res);
    if (!score || !grade || !remark) {
        res.status(422).json({
            status: 422,
            success: false,
            message: 'Score, Grade and Remark are required',
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
    const existingGrade = yield prisma_config_1.default.grade.findUnique({
        where: { uuid },
    });
    if (!existingGrade) {
        res.status(404).json({
            status: 404,
            success: false,
            message: 'Grade not found',
        });
        return;
    }
    const result = yield prisma_config_1.default.grade.update({
        where: { uuid },
        data: {
            grade,
            score,
            remark,
            description,
        },
    });
    res.status(200).json({
        status: 200,
        success: true,
        message: 'Grade updated',
        data: { grade: result },
    });
});
exports.update = update;
/**
 * Remove a grade
 * @route DELETE /api/v1/grades/:uuid
 * @param req
 * @param res
 * @returns
 */
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uuid } = req.params;
    const token = req.headers.authorization || null;
    verifyToken(token, res);
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
        const grade = yield prisma_config_1.default.grade.findUnique({
            where: { uuid: uuid },
        });
        if (!grade) {
            res.status(404).json({
                status: 404,
                success: false,
                message: 'Grade not found',
            });
            return;
        }
        yield prisma_config_1.default.grade.delete({
            where: { uuid: uuid },
        });
        res.status(200).json({
            status: 200,
            success: true,
            message: 'Grade deleted',
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
