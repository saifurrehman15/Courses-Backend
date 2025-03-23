
import Joi from "joi";

export const validateSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().length(6).required(),
});
