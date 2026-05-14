import { Router } from "express";
import validate from "../../common/middleware/validate.middleware.js";
import SubmitVoteDto from "./dto/submit-vote.dto.js";
import * as controller from "./vote.controller.js";
import { optionalAuthenticate } from "../auth/auth.middleware.js";

const router = Router();

router.post("/", optionalAuthenticate, validate(SubmitVoteDto), controller.submitVote);

export default router;
