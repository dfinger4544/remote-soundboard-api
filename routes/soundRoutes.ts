import express from "express";
const router = express.Router();

import * as soundCtrl from "../controllers/soundController";

// GET - sound(s)
router.get("/", soundCtrl.getSounds);
router.get("/:soundId", soundCtrl.getSound);

// GET - play sound on server
router.get("/:soundId/play", soundCtrl.playSound);

// POST - new sound
router.post("/", soundCtrl.postSound);

// PUT - update sound
router.put("/:soundId", soundCtrl.updateSound);

// DELETE - delete sound
router.delete("/:soundId", soundCtrl.deleteSound);

export default router;
