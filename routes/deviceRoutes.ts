import express from "express";
const router = express.Router();

import * as deviceCtrl from "../controllers/deviceController";

router.get("/platform", deviceCtrl.getPlatform);

export default router;
