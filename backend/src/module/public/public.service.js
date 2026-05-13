import ApiError from "../../common/utils/api-error.js";
import { Poll, Question } from "../poll/poll.model.js";

const getPublicPollByShareCode = async (shareCode) => {
  const poll = await Poll.findOne({ shareCode }).lean();
  //lean is used to sahre a plain JS object inspite of a complex mongoose model

  if (!poll) throw ApiError.notFound("Poll not found");

  const questions = await Question.find({ pollId: poll._id })
    .sort({ questionNumber: 1 })
    .lean();

  return {
    pol: {
      id: poll._id,
      pollName: poll.pollName,
      pollDescription: poll.pollDescription,
      pollDurationInMinutes: poll.pollDurationInMinutes,
      pollStartTime: poll.pollStartTime,
      pollEndTime: poll.pollEndTime,
      isAnonymousAllowed: poll.isAnonymousAllowed,
      shareCode: poll.shareCode,
      status: poll.status,
    },
    questions: questions.map((question) => ({
      id: question._id,
      question: question.question,
      questionNumber: question.questionNumber,
      options: question.options
                .slice()
                .sort((a,b)=>a.order - b.order)
                .map((option)=>({
                    id: option._id,
                    text: option.text,
                    order: option.order,
                }))
    })),
  };
};
export { getPublicPollByShareCode };

