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
  };

  const questionDoc=await Question.create({
    pollId,
    question,
    questionNumber,
    options,
  });

  return questionDoc;
};

const getMyPolls = async (userId)=>{
    const polls = await Poll.find({createdBy: userId}).sort({createdAt: -1});

    return polls;
}

const getPollById = async ({pollId, userId})=>{
    const poll = await Poll.findOne({_id:pollId, createdBy:userId});

    if(!poll){
        throw ApiError.notFound("Poll not found");
    }

    const questions = (await Question.find({pollId})).sort({questionNumber: 1});

    return ({
        poll,
        questions,
    })
};

export  {createPoll, createQuestion, getMyPolls, getPollById};