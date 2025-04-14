import Joi from "joi";

const validateSchema = Joi.object({
  title: Joi.string().min(3).required(),
  description: Joi.string().min(3).required(),
  image: Joi.string().required(),
  level: Joi.string().required(),
  category: Joi.string().required(),
  createdBy: Joi.string().required(),
  featured: Joi.boolean().required(),
});

const updateSchema = Joi.object({
  title: Joi.string().min(3).optional(),
  description: Joi.string().min(3).optional(),
  image: Joi.string().optional(),
  level: Joi.string().optional(),
  category: Joi.string().optional(),
  featured: Joi.boolean().optional(),
});

export { validateSchema, updateSchema };
