import ApiError from "../utils/api-error.js";

const validate = (DtoClass) => {
  return (req, res, next) => {
    const { error, value } = DtoClass.validate(req.body);

    if (error) {
      throw ApiError.badRequest(
        error.details.map(item => item.message).join("; ")
      );
    }

    req.body = value;
    next();
  };
};

export default validate;