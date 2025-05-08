import Joi from "joi";

export const validateSchema = Joi.object({
  title: Joi.string().trim().min(3).required(),
  description: Joi.string().trim().min(3).required(),
  category: Joi.string().required(),
  institute:Joi.string().required(),
  url: Joi.string().uri().required(),
  type: Joi.string().valid("video", "pdf", "word").required(),
});

export const validateSchemaUpdate = Joi.object({
  title: Joi.string().trim().min(3).optional(),
  description: Joi.string().trim().optional(),
  url: Joi.string().uri().optional(),
  type: Joi.string().valid("video", "pdf", "word").optional(),
});
