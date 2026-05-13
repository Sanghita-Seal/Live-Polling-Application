import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";

class CreateQuestionDto extends BaseDto {
  static schema = Joi.object({
    question: Joi.string().trim().min(3).max(300).required(),

    questionNumber: Joi.number().integer().positive().required(),

    options: Joi.array()
      .items(
        Joi.object({
          text: Joi.string().trim().min(1).max(200).required(),
          order: Joi.number().integer().positive().required(),
        }),
      )
      .min(2)
      .max(4)
      .required(),
  });
}

export default CreateQuestionDto;
