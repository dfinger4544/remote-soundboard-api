import * as os from "os";
import * as path from "path";

import { Request, Response, NextFunction } from "express";
import { exec } from "child_process";
import Player from "play-sound";
const player = Player();

const platform = os.platform();
const beep = path.join(__dirname, "..", "data", "beep.wav");
console.log(beep);

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
    exec("amixer -q sset Master 5%+", (err) => {
      if (err) throw err;
      exec(
        "amixer sget Master | grep 'Right:' | awk -F'[][]' '{ print $2 }'",
        (err, value) => {
          if (err) throw err;

          player.play(beep);
          res
            .status(200)
            .json({ message: "Volume increased", volume: value.trim() });
        }
      );
    });
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
    exec("amixer -q sset Master 5%-", (err) => {
      if (err) throw err;
      exec(
        "amixer sget Master | grep 'Right:' | awk -F'[][]' '{ print $2 }'",
        (err, value) => {
          if (err) throw err;

          player.play(beep);
          res
            .status(200)
            .json({ message: "Volume decreased", volume: value.trim() });
        }
      );
    });
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

export async function reboot(req: Request, res: Response, next: NextFunction) {
  try {
    if (platform !== "linux") {
      const error: any = new Error(`Setting is not accessible on ${platform}`);
      error.statusCode = 503;
      throw error;
    }
    exec("sudo reboot -h now");
  } catch (err) {
    next(err);
  }
}
