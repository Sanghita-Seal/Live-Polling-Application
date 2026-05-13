import ApiResponse from "../../common/utils/api-response.js";
import * as voteService from "./vote.service.js";

const submitVote = async (req, res) => {
  const vote = await voteService.submitVote({
    ...req.body,
    userId: req.user?.id,
  });

  ApiResponse.created(res, "Vote submitted successfully", vote);
};

export { submitVote };
