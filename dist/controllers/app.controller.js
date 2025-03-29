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
exports.app = void 0;
const prisma_config_1 = __importDefault(require("../config/prisma.config"));
/**
 * @description Fetch app
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 * @returns {Promise<Response>} - Response object
 */
const app = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma_config_1.default.$connect().catch((error) => {
            throw new Error("Database connection failed: " + error.message);
        });
        res.status(200).json({
            status: 200,
            success: true,
            message: "Database connected",
            data: {
                ipAddress: req.ip,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: error.message,
            data: {
                ipAddress: req.ip,
            },
        });
    }
});
exports.app = app;
