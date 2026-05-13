import { Router } from "express";
import * as controller from "./public.controller.js"

const router = Router();


router.get("/polls/:shareCode", controller.getPublicPoll);

export default router;