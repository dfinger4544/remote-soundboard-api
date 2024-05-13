import * as fs from "fs";
import * as path from "path";

import express, { Request, Response, NextFunction } from "express";
import { json } from "body-parser";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import * as dotenv from "dotenv";
dotenv.config();

// public folder
const dataPath = path.join(__dirname, "public", "sounds.json"),
  soundsFolder = path.join(__dirname, "public", "sounds"),
  imagesFolder = path.join(__dirname, "public", "images");

if (!fs.existsSync(soundsFolder))
  fs.mkdirSync(soundsFolder, { recursive: true });
if (!fs.existsSync(imagesFolder))
  fs.mkdirSync(imagesFolder, { recursive: true });
if (!fs.existsSync(dataPath))
  fs.writeFileSync(dataPath, JSON.stringify({ sounds: [] }), "utf-8");

const multerFileTypes: {
  [key: string]: string[];
} = {
  audio: ["audio/wav", "audio/wave", "audio/mpeg"],
  image: ["image/png", "image/jpg", "image/jpeg"],
};
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "image") {
      cb(null, imagesFolder);
    } else if (file.fieldname === "audio") {
      cb(null, soundsFolder);
    }
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4());
  },
});

// app setup
const app = express();
app.use(json());
app.use(
  multer({
    storage: multerStorage,
    fileFilter: (req, file, cb) => {
      // must be valid image or sound
      if (multerFileTypes[file.fieldname].includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(null, false);
      }
    },
  }).fields([
    { name: "image", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ])
);

// routes
import soundRoutes from "./routes/soundRoutes";

app.get("/", (req, res, next) => {
  res.status(200).json({ message: "test" });
});
app.use("/sounds", soundRoutes);
app.use("/files", express.static(soundsFolder)); // static for sound files
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500).json({ message: err.message });
});

const port = process.env.port || 3000;
app.listen(port, () => console.log(`App started on ${port}`));
