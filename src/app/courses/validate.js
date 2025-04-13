import Joi from "joi";

export const validateSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.string().required(),
  level: Joi.string().required(),
  category: Joi.string().required(),
  createdBy: Joi.string().required(),
  featured: Joi.boolean().required(),
});
