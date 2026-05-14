import ApiResponse from "../../common/utils/api-response.js";
import { getCreatorAnalyticsByPollId } from "../public/public.service.js";
import * as pollService from "./poll.service.js";

const createPoll = async (req, res) => {
  const poll = await pollService.createPoll({
    ...req.body,
    userId: req.user.id,
  });

  ApiResponse.created(res, "Poll Created Successfully", poll);
};

const createQuestion = async (req, res) => {
  const question = await pollService.createQuestion({
    pollId: req.params.pollId,
    userId: req.user.id,
    ...req.body,
  });
  ApiResponse.created(res, "Question created successfully", question);
};

const getMyPolls = async (req, res) => {
  const polls = await pollService.getMyPolls(req.user.id);

  ApiResponse.ok(res, "Polls fetched successfully", polls);
};

const getPollById = async (req, res) => {
  const poll = await pollService.getPollById({
    pollId: req.params.pollId,
    userId: req.user.id,
  });
  ApiResponse.ok(res, "Poll fetched successfully", poll);
};
const updatePoll = async (req, res) => {
  const poll = await pollService.updatePoll({
    pollId: req.params.pollId,
    userId: req.user.id,
    ...req.body,
  });
  ApiResponse.ok(res, "Poll updated successfully", poll);
};

const publishResults = async (req, res) => {
  const poll = await pollService.publishResults({
    pollId: req.params.pollId,
    userId: req.user.id,
  });

  ApiResponse.ok(res, "Poll results published successfully", poll);
};

const getPollAnalytics = async (req, res) => {
  const analytics = await getCreatorAnalyticsByPollId({
    pollId: req.params.pollId,
    userId: req.user.id,
  });

  ApiResponse.ok(res, "Poll analytics fetched successfully", analytics);
};

export { createPoll, createQuestion, getMyPolls, getPollById, updatePoll, publishResults, getPollAnalytics};
