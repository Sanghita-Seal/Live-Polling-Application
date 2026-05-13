import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";

class SubmitVoteDto extends BaseDto {
  static schema = Joi.object({
    pollId: Joi.string().required(),
    questionId: Joi.string().required(),
    optionId: Joi.string().required(),

    userFingerPrint: Joi.string().trim().optional(),
    firstName: Joi.string().trim().optional(),
    lastName: Joi.string().trim().optional(),
  });
}

export default SubmitVoteDto;
