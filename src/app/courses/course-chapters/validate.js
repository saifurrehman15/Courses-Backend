import Joi from "joi";

export const validateSchema = Joi.object({
  title: Joi.string().trim().min(3).required(),
  category: Joi.string().required(),
  course: Joi.string().required(),
  institute: Joi.string().required(),
  description: Joi.string().trim().min(3).required(),
  content: Joi.array()
    .items(
      Joi.object({
        title: Joi.string().trim().min(3).required(),
        url: Joi.string().uri().required(),
        description: Joi.string().trim().min(3).required(),
        type: Joi.string().valid("video", "pdf", "word").required(),
      })
    )
    .required(),
});

export const validateSchemaUpdate = Joi.object({
  title: Joi.string().trim().min(3).optional(),
  description: Joi.string().trim().min(3).optional(),
  content: Joi.array()
    .items(
      Joi.object({
        title: Joi.string().trim().min(3).optional(),
        url: Joi.string().uri().optional(),
        description: Joi.string().trim().optional(),
        type: Joi.string().valid("video", "pdf", "word").optional(),
      })
    )
    .optional(),
});
