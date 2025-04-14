import Joi from "joi";

export const validateCategory = Joi.object({
  title: Joi.string().min(3).required(),
  description: Joi.string().min(3).required(),
  icon: Joi.string().required(),
  course: Joi.string().required(),
});
