import express from "express";
const router = express.Router();

import * as deviceCtrl from "../controllers/deviceController";

router.get("/platform", deviceCtrl.getPlatform);
router.get("/volumeUp", deviceCtrl.volumeUp);
router.get("/volumeDown", deviceCtrl.volumeDown);
router.get("/volume", deviceCtrl.volume);
router.get("/shutdown", deviceCtrl.shutdown);
router.get("/reboot", deviceCtrl.reboot);

export default router;
