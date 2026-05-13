import ApiError from "../../common/utils/api-error.js";
import { Poll, Question } from "../poll/poll.model.js";
import Vote from "./vote.model.js";

const submitVote = async ({
  pollId,
  questionId,
  optionId,
  userId,
  userFingerPrint,
  firstName,
  lastName,
}) => {
  const poll = await Poll.findById(pollId);

  if (!poll) {
    throw ApiError.notFound("Poll not found");
  }

  if (poll.status !== "active") {
    throw ApiError.badRequest("Poll is not active");
  }

  if (poll.pollEndTime && poll.pollEndTime.getTime() < Date.now()) {
    poll.status = "ended";
    await poll.save();

    throw ApiError.badRequest("Poll has ended");
  }

  if (!userId && !poll.isAnonymousAllowed) {
    throw ApiError.forbidden("Anonymous voting is not allowed");
  }

  const question = await Question.findOne({ _id: questionId, pollId });

  if (!question) {
    throw ApiError.notFound("Question not found");
  }

  const selectedOption = question.options.find(
    (option) => String(option._id) === optionId,
  );

  if (!selectedOption) {
    throw ApiError.notFound("Option not found");
  }

  const existingVote = await Vote.findOne({
    pollId,
    questionId,
    ...(userId ? { userId } : { userFingerPrint }),
  });

  if (existingVote) {
    throw ApiError.conflict("You have already voted for this question");
  }

  const previousParticipation = await Vote.findOne({
    pollId,
    ...(userId ? { userId } : { userFingerPrint }),
  });

  const vote = await Vote.create({
    pollId,
    questionId,
    optionId,
    userId: userId || null,
    userFingerPrint: userFingerPrint || null,
    firstName: firstName || null,
    lastName: lastName || null,
  });

  selectedOption.votes += 1;
  await question.save();

  poll.totalVotes += 1;

  if (!previousParticipation) {
    poll.totalParticipants += 1;
  }

  await poll.save();

  return vote;
};

export { submitVote };
