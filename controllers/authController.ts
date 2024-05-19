import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";

import User from "../models/userModel";

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const username = req.body.username;
    const password = req.body.password;

    const user = await User.findOne({ where: { username } });
    if (!user) {
      const error: any = new Error("Failed to login");
      error.statusCode = 401;
      throw error;
    }

    const correctPassword = await bcrypt.compare(password, user.password);
    if (!correctPassword) {
      const error: any = new Error("Failed to login");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
      },
      process.env.JWT_SECRET || "secret",
      {
        expiresIn: "1h",
      }
    );

    res
      .status(200)
      .json({ message: "Logged in successfully", token, userId: user.id });
  } catch (err) {
    next(err);
  }
}

export async function createUser(req: any, res: Response, next: NextFunction) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error: any = new Error("Validation failed");
      error.statusCode = 422;
      error.errors = errors;
      throw error;
    }

    const username = req.body.username;
    const userExists = (await User.count({ where: { username } })) > 0;
    if (userExists) {
      const error: any = new Error("User already exists");
      error.statusCode = 400;
      throw error;
    }

    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      username,
      password: hashedPassword,
    });

    res.status(200).json({ message: "User created", userId: user.id });
  } catch (err) {
    next(err);
  }
}

export async function updatePassword(
  req: any,
  res: Response,
  next: NextFunction
) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error: any = new Error("Validation failed");
      error.statusCode = 422;
      error.errors = errors;
      throw error;
    }

    const currentPassword = req.body.currentPassword;
    const newPassword = req.body.newPassword;

    const user = await User.findByPk(req.userId);
    if (!user) {
      const error: any = new Error("User not found");
      error.statusCode = 401;
      throw error;
    }

    const correctPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!correctPassword) {
      const error: any = new Error("Current password is incorrect");
      error.statusCode = 404;
      throw error;
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedNewPassword;
    await user.save();

    res.status(201).json({ message: "User updated", userId: user.id });
  } catch (err) {
    next(err);
  }
}
