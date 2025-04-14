import Joi from "joi";

export const validateSchema = Joi.object({
  title: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
  category: Joi.string().required(),
  url: Joi.string().uri().required(),
  type: Joi.string().valid("video", "pdfs", "word").required(),
});
