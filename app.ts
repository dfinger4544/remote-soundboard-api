import * as fs from "fs";
import * as path from "path";

import socket from "./util/socket";
import express, { Request, Response, NextFunction } from "express";
import { json } from "body-parser";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import * as dotenv from "dotenv";
import sequelize from "./util/sequelize";
import * as bcrypt from "bcrypt";
import Player from "play-sound";
const player = Player();
dotenv.config();

// public folder
const soundsFolder = path.join(__dirname, "public", "sounds"),
  imagesFolder = path.join(__dirname, "public", "images");
if (!fs.existsSync(soundsFolder))
  fs.mkdirSync(soundsFolder, { recursive: true });
if (!fs.existsSync(imagesFolder))
  fs.mkdirSync(imagesFolder, { recursive: true });

// images / audio only
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

// register buttons (if existenabled in config
import gpio from "./util/gpio";
gpio.init();

// models
import User from "./models/userModel";

// middleware
import isAuth from "./middleware/is-auth.js";

// routes
import authRoutes from "./routes/authRoutes";
import soundRoutes from "./routes/soundRoutes";
import deviceRoutes from "./routes/deviceRoutes";

app.use("/auth", authRoutes);
app.use("/sounds", isAuth, soundRoutes);
app.use("/device", isAuth, deviceRoutes);
app.use("/files", isAuth, express.static(soundsFolder)); // static for sound files
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res
    .status(err.status || 500)
    .json({ message: err.message, errors: err.errors?.errors });
});

const init = async function () {
  await sequelize.sync(/* { force: true } */);

  // create default user (if not exists)
  const defaultPassword = await bcrypt.hash("root", 12);
  await User.findOrCreate({
    where: { username: "root" },
    defaults: {
      username: "root",
      password: defaultPassword,
    },
  });

  // start server
  const port = process.env.PORT || 3000;
  const server = app.listen(port, () => {
    console.log(`App started on ${port}`);
  });
  socket.init(server);

  // if root password is default, tell user to change
  const rootUser = await User.findOne({ where: { username: "root" } });
  const isDefaultPassword = await bcrypt.compare("root", rootUser!.password);
  if (isDefaultPassword)
    console.log(
      "Root user still uses the default password. Please change ASAP!"
    );
  player.play(path.join(__dirname, "data", "success.wav"));
};

init();
