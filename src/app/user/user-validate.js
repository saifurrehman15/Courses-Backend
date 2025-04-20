import Joi from "joi";

const validateSchema = Joi.object({
  userName: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().length(6).required(),
  provider: Joi.string().default("credientials"),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().length(6).required(),
});

export { validateSchema, loginSchema };
