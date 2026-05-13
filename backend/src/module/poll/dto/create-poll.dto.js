import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";

class CreatePollDto extends BaseDto {
  static schema = Joi.object({
    pollName: Joi.string().trim().min(3).max(100).required(),
    pollDescription: Joi.string().trim().min(3).max(500).required(),
    pollDurationInMinutes: Joi.number().integer().min(1).max(60).required(),
    isAnonymousAllowed: Joi.boolean().default(false),
  });
}

export default CreatePollDto;