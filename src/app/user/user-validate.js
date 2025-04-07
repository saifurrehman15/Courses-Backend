import Joi from "joi";

export const validateSchema = Joi.object({
  // userName: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().length(6).required(),
});
