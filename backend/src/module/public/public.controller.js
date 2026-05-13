import ApiResponse from "../../common/utils/api-response.js";
import * as publicService from "./public.service.js";

const getPublicPoll = async (req, res) => {
  const poll = await publicService.getPublicPollByShareCode(req.params.shareCode);

  ApiResponse.ok(res, "Poll fetched successfully", poll);
};

export { getPublicPoll };
