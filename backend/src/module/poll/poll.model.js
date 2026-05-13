import Joi from "joi";
import mongoose, { Schema } from "mongoose";

const PollSchema = new Schema(
  {
    pollName: {
      type: String,
      required: true,
      trim: true,
    },
    pollDescription: {
      type: String,
      required: true,
      trim: true,
    },
    pollDurationInMinutes: {
      type: Number,
      required: true,
      min: 1,
      max: 60,
    },
    pollStartTime: {
      type: Date,
      default: null,
    },
    pollEndTime: {
      type: Date,
      default: null,
    },
    isAnonymousAllowed: {
      type: Boolean,
      default: false,
    },
    shareCode: {
      type: String,
      required: true,
      unique: true,
      default: () => new mongoose.Types.ObjectId().toString(),
    },
    analyticsCode: {
      type: String,
      required: true,
      unique: true,
      default: () => new mongoose.Types.ObjectId().toString(),
    },
    status: {
      type: String,
      enum: ["draft", "active", "ended"],
      default: "draft",
    },
    totalVotes: {
      type: Number,
      default: 0,
    },
    totalParticipants: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

const QuestionSchema = new Schema({
  question: {
    type: String,
    required: true,
    trim: true,
  },
  pollId: {
    type: Schema.Types.ObjectId,
    ref: "Poll",
    required: true,
    index: true,
  },
  questionNumber: {
    type: Number,
    required: true,
  },
  options: {
    type: [
      {
        text: {
          type: String,
          required: true,
          trim: true,
        },
        order: {
          type: Number,
          required: true,
        },
        votes: {
          type: Number,
          default: 0,
        },
      },
    ],
    validate: {
      validator(value) {
        return value.length >= 2 && value.length <= 4; // options min 2 & max 4 hoga
      },
      message: "Options must contain between 2 and 4 items",
    },
  },
},{timestamps: true},
);


const Poll= mongoose.model("Poll", PollSchema);
const Question = mongoose.model("Question", QuestionSchema);

export {Poll, Question};