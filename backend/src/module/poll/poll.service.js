import ApiError from "../../common/utils/api-error.js";
import { Poll, Question } from "./poll.model.js";

const createPoll = async ({
  pollName,
  pollDescription,
  pollDurationInMinutes,
  isAnonymousAllowed,
  userId,
}) => {
  const poll = await Poll.create({
    pollName,
    pollDescription,
    pollDurationInMinutes,
    isAnonymousAllowed,
    createdBy: userId,
  });

  return poll;
};

const createQuestion = async ({
  pollId,
  userId,
  question,
  questionNumber,
  options,
}) => {
  const poll = await Poll.findOne({ _id: pollId, createdBy: userId });

  if (!poll) {
    throw ApiError.notFound("Poll not found");
  }

  const existingQuestion = await Question.findOne({ pollId, questionNumber });

  if (existingQuestion) {
    throw ApiError.conflict("Question number already exists for thsi poll");
  }

  const orders = options.map((option) => option.order);
  const uniqueOrders = new Set(orders);

  if (uniqueOrders.size !== orders.length) {
    throw ApiError.badRequest("Option order must be unique");
  }

  const questionDoc = await Question.create({
    pollId,
    question,
    questionNumber,
    options,
  });

  return questionDoc;
};

const getMyPolls = async (userId) => {
  const polls = await Poll.find({ createdBy: userId }).sort({ createdAt: -1 });

  return polls;
};

const getPollById = async ({ pollId, userId }) => {
  const poll = await Poll.findOne({ _id: pollId, createdBy: userId });

  if (!poll) {
    throw ApiError.notFound("Poll not found");
  }

  const questions = await Question.find({ pollId }).sort({ questionNumber: 1 });

  return {
    poll,
    questions,
  };
};

const updatePoll = async ({
  pollId,
  userId,
  pollName,
  pollDescription,
  pollDurationInMinutes,
  isAnonymousAllowed,
  status,
}) => {
  const poll = await Poll.findOne({ _id: pollId, createdBy: userId });

  if (!poll) {
    throw ApiError.notFound("Poll not found");
  }

  if (pollName !== undefined) {
    poll.pollName = pollName;
  }

  if (pollDescription !== undefined) {
    poll.pollDescription = pollDescription;
  }

  if (pollDurationInMinutes !== undefined) {
    poll.pollDurationInMinutes = pollDurationInMinutes;

    if (poll.pollStartTime) {
    poll.pollEndTime = new Date(
      poll.pollStartTime.getTime() + pollDurationInMinutes * 60 * 1000,
    );
  }
  }

  

  if (isAnonymousAllowed !== undefined) {
    poll.isAnonymousAllowed = isAnonymousAllowed;
  }

  if (status !== undefined) {
    if (status === "active" && poll.status !== "active") {
    const startTime = new Date();


      poll.pollStartTime = startTime;
      poll.pollEndTime = new Date(
        startTime.getTime() + poll.pollDurationInMinutes * 60 * 1000,
      );
    }

    poll.status = status;
  }

  return poll.save();
};

export { createPoll, createQuestion, getMyPolls, getPollById, updatePoll };
