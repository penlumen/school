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
exports.signIn = exports.signUp = void 0;
const prisma_config_1 = __importDefault(require("../../config/prisma.config"));
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield prisma_config_1.default.user.create({
            data: {
                email,
                password,
            },
        });
        res.status(201).json({
            status: 201,
            success: true,
            message: "User created successfully",
            data: { user },
        });
    }
    catch (error) {
        res.status(400).json({
            status: 400,
            success: false,
            message: error.message,
        });
    }
});
exports.signUp = signUp;
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield prisma_config_1.default.user.findUnique({
            where: {
                email,
            },
        });
        if (!user) {
            res.status(404).json({
                status: 404,
                success: false,
                message: "User not found",
            });
        }
        res.status(200).json({
            status: 200,
            success: true,
            message: "User logged in successfully",
            data: { user },
        });
    }
    catch (error) {
        res.status(400).json({
            status: 400,
            success: false,
            message: error.message,
        });
    }
});
exports.signIn = signIn;
