import * as fs from "fs";
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import sequelize from "../util/sequelize";

/* import io from "../util/socket"; */

/* import { Sound, ISound } from "../models/soundModel"; */
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error: any = new Error("Validation failed");
      error.statusCode = 422;
      error.errors = errors;
      throw error;
    }

    const soundId = req.params.soundId;
    const sound = await Sound.findByPk(soundId);
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error: any = new Error("Validation failed");
      error.statusCode = 422;
      error.errors = errors;
      throw error;
    }

    const soundId = req.params.soundId;
    const sound = await Sound.findByPk(soundId);
    if (!sound) {
      const error: any = new Error("No sound found");
      error.status = 404;
      throw error;
    }

    const success: boolean = await sound.play();
    if (!success)
      return res.status(200).json({ message: "Error playing sound", sound });

    res
      .status(200)
      .json({ message: "Sound played successfully", soundId: soundId });
  } catch (err) {
    next(err);
  }
}

export async function playRandomSound(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const sound = await Sound.findOne({ order: sequelize.random() });
    if (!sound) {
      const error: any = new Error("No sound found");
      error.status = 404;
      throw error;
    }

    const success: boolean = await sound.play();
    if (!success)
      return res.status(200).json({ message: "Error playing sound", sound });

    res
      .status(200)
      .json({ message: "Sound played successfully", soundId: sound.id });
  } catch (err) {
    next(err);
  }
}

export async function postSound(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let files, imageFile, audioFile;
  try {
    files = req.files as { [fieldname: string]: Express.Multer.File[] };
    imageFile = files?.image?.pop();
    audioFile = files?.audio?.pop();

    if (!imageFile || !audioFile) {
      const error: any = new Error("No image or sound provided");
      error.status = 422;
      throw error;
    }

    const name = req.body.name,
      imagePath = imageFile.path.replace("\\", "/"),
      soundPath = audioFile.path.replace("\\", "/");

    const nameExists = (await Sound.count({ where: { name } })) > 0;
    if (nameExists) {
      const error: any = new Error("Sound name already exists");
      error.status = 422;
      throw error;
    }

    const sound = await Sound.create({ name, imagePath, soundPath });

    res.status(200).json({ message: "Sound uploaded successfully", sound });
  } catch (err) {
    if (imageFile) fs.rmSync(imageFile.path);
    if (audioFile) fs.rmSync(audioFile.path);

    next(err);
  }
}

export async function updateSound(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const soundId = req.params.soundId;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const name = req.body.name,
      imageFile = files?.image?.pop(),
      audioFile = files?.audio?.pop();

    // get sound by id
    const sound = await Sound.findByPk(soundId);
    if (!sound) {
      // clean up files on error
      if (imageFile) fs.rmSync(imageFile.path);
      if (audioFile) fs.rmSync(audioFile.path);

      // throw error
      const error: any = new Error(`No sound found for ${soundId}`);
      error.status = 404;
      throw error;
    }

    if (name) sound.name = name;
    if (imageFile) sound.imagePath = imageFile.path;
    if (audioFile) sound.imagePath = audioFile.path;
    await sound.save();

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
    const sound = await Sound.findByPk(soundId);
    if (!sound) {
      const error: any = new Error(`No sound found for ${soundId}`);
      error.status = 404;
      throw error;
    }
    await sound.destroy();

    res
      .status(200)
      .json({ message: "Sound deleted successfully", soundId: soundId });
  } catch (err) {
    next(err);
  }
}
