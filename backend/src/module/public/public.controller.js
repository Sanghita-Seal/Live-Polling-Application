import ApiResponse from "../../common/utils/api-response.js";
import * as publicService from "./public.service.js";

const getPublicPoll = async (req, res) => {
  const poll = await publicService.getPublicPollByShareCode(req.params.shareCode);

  ApiResponse.ok(res, "Poll fetched successfully", poll);
};
const getPublicAnalytics = async (req, res) => {
  const analytics = await publicService.getPublicAnalyticsByCode(
    req.params.analyticsCode,
  );

  ApiResponse.ok(res, "Analytics fetched successfully", analytics);
};


export { getPublicPoll , getPublicAnalytics};
