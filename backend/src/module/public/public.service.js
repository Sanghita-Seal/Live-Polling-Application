import ApiError from "../../common/utils/api-error.js";
import { expirePollIfNeeded } from "../poll/poll-expiry.service.js";
import { Poll, Question } from "../poll/poll.model.js";

const getPublicPollByShareCode = async (shareCode) => {
  const pollDoc = await Poll.findOne({ shareCode });
  //lean is used to sahre a plain JS object inspite of a complex mongoose model

  if (!pollDoc) throw ApiError.notFound("Poll not found");

  await expirePollIfNeeded(pollDoc);

  const poll = pollDoc.toObject();

  const questions = await Question.find({ pollId: poll._id })
    .sort({ questionNumber: 1 })
    .lean();

  return {
    poll: {
      id: poll._id,
      pollName: poll.pollName,
      pollDescription: poll.pollDescription,
      pollDurationInMinutes: poll.pollDurationInMinutes,
      pollStartTime: poll.pollStartTime,
      pollEndTime: poll.pollEndTime,
      isAnonymousAllowed: poll.isAnonymousAllowed,
      shareCode: poll.shareCode,
      status: poll.status,
      isResultPublished: poll.isResultPublished,
      resultPublishedAt: poll.resultPublishedAt,
      totalVotes: poll.isResultPublished ? poll.totalVotes : undefined,
      totalParticipants: poll.isResultPublished ? poll.totalParticipants : undefined,
    },
    questions: questions.map((question) => ({
      id: question._id,
      question: question.question,
      questionNumber: question.questionNumber,
      isRequired: question.isRequired,
      options: question.options
                .slice()
                .sort((a,b)=>a.order - b.order)
                .map((option)=>({
                    id: option._id,
                    text: option.text,
                    order: option.order,
                    votes: poll.isResultPublished ? option.votes : undefined,
                }))
    })),
  };
};
const getPublicAnalyticsByCode = async (analyticsCode) => {
  const pollDoc = await Poll.findOne({ analyticsCode });

  if (!pollDoc) {
    throw ApiError.notFound("Poll not found");
  }

  await expirePollIfNeeded(pollDoc);

  const poll = pollDoc.toObject();

  const questions = await Question.find({ pollId: poll._id })
    .sort({ questionNumber: 1 })
    .lean();

  return {
    poll: {
      id: poll._id,
      pollName: poll.pollName,
      pollDescription: poll.pollDescription,
      pollDurationInMinutes: poll.pollDurationInMinutes,
      pollStartTime: poll.pollStartTime,
      pollEndTime: poll.pollEndTime,
      isAnonymousAllowed: poll.isAnonymousAllowed,
      shareCode: poll.shareCode,
      analyticsCode: poll.analyticsCode,
      status: poll.status,
      totalVotes: poll.totalVotes,
      totalParticipants: poll.totalParticipants,
      isResultPublished: poll.isResultPublished,
      resultPublishedAt: poll.resultPublishedAt,
    },
    questions: questions.map((question) => ({
      id: question._id,
      question: question.question,
      questionNumber: question.questionNumber,
      isRequired: question.isRequired,
      options: question.options
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((option) => ({
          id: option._id,
          text: option.text,
          order: option.order,
          votes: option.votes,
        })),
    })),
  };
};

export { getPublicPollByShareCode, getPublicAnalyticsByCode };

