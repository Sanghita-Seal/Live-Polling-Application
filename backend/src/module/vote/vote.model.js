import mongoose, { Schema } from "mongoose";

const VoteSchema = new Schema(
  {
    pollId: {
      type: Schema.Types.ObjectId,
      ref: "Poll",
      required: true,
      index: true,
    },
    questionId: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: true,
      index: true,
    },
    optionId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    userFingerPrint: {
      type: String,
      trim: true,
      default: null,
    },
    firstName: {
      type: String,
      trim: true,
      default: null,
    },
    lastName: {
      type: String,
      trim: true,
      default: null,
    },
  },
  { timestamps: true },
);

VoteSchema.index(
  { pollId: 1, questionId: 1, userId: 1 },
  {
    unique: true,
    partialFilterExpression: { userId: { $exists: true, $ne: null } },
  },
);

VoteSchema.index(
  { pollId: 1, questionId: 1, userFingerPrint: 1 },
  {
    unique: true,
    partialFilterExpression: { userFingerPrint: { $exists: true, $ne: null } },
  },
);

const Vote = mongoose.model("Vote", VoteSchema);

export default Vote;
