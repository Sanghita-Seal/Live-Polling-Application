import { Router } from "express";
import validate from "../../common/middleware/validate.middleware.js";
import SubmitVoteDto from "./dto/submit-vote.dto.js";
import * as controller from "./vote.controller.js";

const router = Router();

router.post("/", validate(SubmitVoteDto), controller.submitVote);

export default router;
