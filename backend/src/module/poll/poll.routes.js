import {Router} from "express";
import { authenticate } from "../auth/auth.middleware.js";
import validate from "../../common/middleware/validate.middleware.js";
import CreatePollDto from "./dto/create-poll.dto.js";
import * as controller from "./poll.controller.js"
import CreateQuestionDto from './dto/create-question.dto.js';

const router = Router();

router.post("/", authenticate, validate(CreatePollDto), controller.createPoll);

router.get("/my-polls", authenticate, controller.getMyPolls);

router.get("/:pollId", authenticate, controller.getPollById);

router.post("/:pollId/question", authenticate, validate(CreateQuestionDto), controller.createQuestion);

export default router;