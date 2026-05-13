import {Router} from "express";
import { authenticate } from "../auth/auth.middleware.js";
import validate from "../../common/middleware/validate.middleware.js";
import CreatePollDto from "./dto/create-poll.dto.js";
import * as controller from "./poll.controller.js"
import CreateQuestionDto from './dto/create-question.dto.js';
import UpdatePollDto from "./dto/update-poll.dto.js";

const router = Router();

router.post("/", authenticate, validate(CreatePollDto), controller.createPoll);

router.get("/my-polls", authenticate, controller.getMyPolls);
router.patch(
    "/:pollId",
    authenticate,
    validate(UpdatePollDto),
    controller.updatePoll,
)

router.get("/:pollId", authenticate, controller.getPollById);

router.post("/:pollId/question", authenticate, validate(CreateQuestionDto), controller.createQuestion);



export default router;