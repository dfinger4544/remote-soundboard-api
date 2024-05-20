import express from "express";
import { body, param } from "express-validator";

import * as soundCtrl from "../controllers/soundController";

const router = express.Router();

// GET - sound
router.get("/", soundCtrl.getSounds);
router.get(
  "/:soundId",
  [
    param("soundId")
      .trim()
      .notEmpty()
      .withMessage("soundId must be present in path"),
  ],
  soundCtrl.getSound
);

// GET - play sound on server
router.get("/random/play", soundCtrl.playRandomSound);
router.get(
  "/:soundId/play",
  [
    param("soundId")
      .trim()
      .notEmpty()
      .withMessage("soundId must be present in path"),
  ],
  soundCtrl.playSound
);

// POST - new sound
router.post(
  "/",
  [body("name").trim().notEmpty().withMessage("Sound name is required")],
  soundCtrl.postSound
);

// PUT - update sound
router.put(
  "/:soundId",
  [
    param("soundId")
      .trim()
      .notEmpty()
      .withMessage("soundId must be present in path"),
  ],
  soundCtrl.updateSound
);

// DELETE - delete sound
router.delete(
  "/:soundId",
  [
    param("soundId")
      .trim()
      .notEmpty()
      .withMessage("soundId must be present in path"),
  ],
  soundCtrl.deleteSound
);

export default router;
