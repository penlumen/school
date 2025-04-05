import prisma from "../../config/prisma.config";
import { RequestHandler, Request, Response } from 'express';

export const signUp: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.create({
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
  } catch (error: any) {
    res.status(400).json({
      status: 400,
      success: false,
      message: error.message,
    });
  }
};

export const signIn: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
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
  } catch (error: any) {
    res.status(400).json({
      status: 400,
      success: false,
      message: error.message,
    });
  }
};
