import * as fs from "fs";
import { Request, Response, NextFunction } from "express";

import Sound from "../models/soundModel";

export async function getSounds(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const sounds = await Sound.findAll();

    return res
      .status(200)
      .json({ message: "sounds retrieved successfully", sounds });
  } catch (err) {
    next(err);
  }
}

export async function getSound(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const soundId = req.params.soundId;
    const sound = await Sound.find(soundId);
    if (!sound) {
      const error: any = new Error("No sound found");
      error.status = 404;
      throw error;
    }

    res.status(200).json({ message: "Sound retrieved successfully", sound });
  } catch (err) {
    next(err);
  }
}

export async function playSound(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const soundId = req.params.soundId;
    const sound = await Sound.find(soundId);
    if (!sound) {
      const error: any = new Error("No sound found");
      error.status = 404;
      throw error;
    }

    await sound.play();

    res.status(200).json({ message: "Sound played successfully", sound });
  } catch (err) {
    next(err);
  }
}

export async function postSound(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const imageFile = files?.image?.pop(),
      audioFile = files?.audio?.pop();

    if (!imageFile || !audioFile) {
      // clean up files on error
      if (imageFile) fs.rmSync(imageFile.path);
      if (audioFile) fs.rmSync(audioFile.path);

      // throw error
      const error: any = new Error("No image or sound provided");
      error.status = 422;
      throw error;
    }

    const name = req.body.name,
      imageFilePath = imageFile.path.replace("\\", "/"),
      soundFilePath = audioFile.path.replace("\\", "/");

    const sound = new Sound(name, soundFilePath, imageFilePath);
    await sound.add();

    res.status(200).json({ message: "Sound uploaded successfully", sound });
  } catch (err) {
    next(err);
  }
}

export function updateSound(req: Request, res: Response, next: NextFunction) {
  try {
    const sound = {};
    res.status(200).json({ message: "Sound updated successfully", sound });
  } catch (err) {
    next(err);
  }
}

export async function deleteSound(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const soundId = req.params.soundId;
    const sound = await Sound.find(soundId);
    if (!sound) {
      const error: any = new Error(`No sound found for ${soundId}`);
      error.status = 404;
      throw error;
    }
    await sound.delete();

    res.status(200).json({ message: "Sound deleted successfully" });
  } catch (err) {
    next(err);
  }
}
