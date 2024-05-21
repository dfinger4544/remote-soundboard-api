import * as os from "os";
import { Request, Response, NextFunction } from "express";

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
export async function volumeUp(
  req: Request,
  res: Response,
  next: NextFunction
) {}
export async function volumeDown(
  req: Request,
  res: Response,
  next: NextFunction
) {}
export async function shutdown(
  req: Request,
  res: Response,
  next: NextFunction
) {}
