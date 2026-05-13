import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";

class UpdatePollDto extends BaseDto {
  static schema = Joi.object({
    pollName: Joi.string().trim().min(3).max(100).optional(),
    pollDescription: Joi.string().trim().min(3).max(500).optional(),
    pollDurationInMinutes: Joi.number().integer().min(1).max(30).optional(),
    isAnonymousAllowed: Joi.boolean().optional(),
    status: Joi.string().valid("draft", "active", "ended").optional(),
  }).min(1);
}

export default UpdatePollDto;
