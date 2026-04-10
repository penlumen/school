import { Request, Response } from "express";
import prisma from "../config/prisma.database";

/**
 * @description Fetch app
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 * @returns {Promise<Response>} - Response object
 */
export const app = async (req: Request, res: Response) => {
  try {
    await prisma.$connect().catch((error: any) => {
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
  } catch (error: any) {
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
      data: {
        ipAddress: req.ip,
      },
    });
  }
};
