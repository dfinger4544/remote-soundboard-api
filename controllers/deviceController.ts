import { Request, Response, NextFunction } from "express";
import * as os from "os";
import { exec } from "child_process";

const platform = os.platform();

export async function getPlatform(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    res.status(200).json({ message: "Retrieved platform", platform });
  } catch (err) {
    next(err);
  }
}
//remote-soundboard.local:8080
export async function volumeUp(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (platform !== "linux") {
      const error: any = new Error(`Setting is not accessible on ${platform}`);
      error.statusCode = 503;
      throw error;
    }
  } catch (err) {
    next(err);
  }
}

export async function volumeDown(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (platform !== "linux") {
      const error: any = new Error(`Setting is not accessible on ${platform}`);
      error.statusCode = 503;
      throw error;
    }
  } catch (err) {
    next(err);
  }
}

export async function shutdown(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (platform !== "linux") {
      const error: any = new Error(`Setting is not accessible on ${platform}`);
      error.statusCode = 503;
      throw error;
    }
    exec("sudo shutdown -h now");
  } catch (err) {
    next(err);
  }
}
