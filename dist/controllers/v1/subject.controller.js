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
 * Get all subjects
 * @route GET /api/v1/subjects
 * @param req
 * @param res
 * @returns
 */
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { class_uuid } = req.params;
    const token = req.headers.authorization || null;
    verifyToken(token, res);
    const subjects = yield prisma_config_1.default.subject.findMany({
        where: {
            class_uuid,
        },
    });
    res.status(200).json({
        status: 200,
        success: true,
        message: 'Subjects retrieved',
        data: { subjects },
    });
});
exports.index = index;
/**
 * Create a new subject
 * @param req
 * @param res
 * @returns
 */
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const { class_uuid } = req.params;
    const { name } = req.body;
    if (!name) {
        res.status(422).json({
            status: 422,
            success: false,
            message: 'Name are required',
        });
        return;
    }
    const existingReg = yield prisma_config_1.default.subject.findUnique({
        where: {
            class_uuid_name: {
                name,
                class_uuid,
            },
        },
    });
    if (existingReg) {
        res.status(400).json({
            status: 400,
            success: false,
            message: 'Subject name already taken for this class',
        });
        return;
    }
    const subject = yield prisma_config_1.default.subject.create({
        data: {
            name,
            class_uuid,
        },
    });
    res.status(201).json({
        status: 201,
        success: true,
        message: 'Subject created',
        data: { subject },
    });
});
exports.create = create;
/**
 * Update a subject by ID
 * @param req
 * @param res
 * @returns
 */
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const { subject_uuid } = req.params;
    const { name, class_uuid } = req.body;
    if (!name || !class_uuid) {
        res.status(422).json({
            status: 422,
            success: false,
            message: 'Name and class are required',
        });
        return;
    }
    const existingSubject = yield prisma_config_1.default.subject.findUnique({
        where: {
            class_uuid_name: {
                name,
                class_uuid,
            },
        },
    });
    if (existingSubject && existingSubject.uuid !== subject_uuid) {
        res.status(400).json({
            status: 400,
            success: false,
            message: 'Subject name already taken for this class',
        });
        return;
    }
    const subject = yield prisma_config_1.default.subject.update({
        where: { uuid: subject_uuid },
        data: {
            name,
            class_uuid,
        },
    });
    res.status(200).json({
        status: 200,
        success: true,
        message: 'Subject updated',
        data: { subject },
    });
});
exports.update = update;
/**
 * Delete a subject by ID
 * @param req
 * @param res
 * @returns
 */
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const { subject_uuid } = req.params;
    yield prisma_config_1.default.subject.delete({
        where: { uuid: subject_uuid },
    });
    res.status(200).json({
        status: 200,
        success: true,
        message: 'Subject deleted',
    });
});
exports.remove = remove;
