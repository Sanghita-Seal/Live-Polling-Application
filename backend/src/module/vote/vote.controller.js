import ApiResponse from "../../common/utils/api-response.js";
import { getAnalyticsByPollId } from "../public/public.service.js";
import * as voteService from "./vote.service.js";

const submitVote = async (req, res) => {
  const vote = await voteService.submitVote({
    ...req.body,
    userId: req.user?.id,
  });

  const io = req.app.get("io");

  if (io) {
    const analytics = await getAnalyticsByPollId(req.body.pollId);
    io.to(`poll:${req.body.pollId}`).emit("poll-vote-updated", analytics);
  }

  ApiResponse.created(res, "Vote submitted successfully", vote);
};

export { submitVote };
