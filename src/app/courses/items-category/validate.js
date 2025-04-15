import Joi from "joi";

const validateCategory = Joi.object({
  title: Joi.string().min(3).required(),
  description: Joi.string().min(3).required(),
  icon: Joi.string().required(),
  course: Joi.string().required(),
});

const updateCategory = Joi.object({
  title: Joi.string().min(3).optional(),
  description: Joi.string().min(3).optional(),
  icon: Joi.string().optional(),
});

export { validateCategory, updateCategory };
