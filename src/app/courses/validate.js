import Joi from "joi";

const validateSchema = Joi.object({
  title: Joi.string().min(3).required(),
  description: Joi.string().min(3).required(),
  image: Joi.string().required(),
  level: Joi.string().required(),
  category: Joi.string().required(),
  courseType: Joi.object({
    type: Joi.string().default("free").required(),
    price: Joi.number().required(),
  }).required(),
});

const updateSchema = Joi.object({
  title: Joi.string().min(3).optional(),
  description: Joi.string().min(3).optional(),
  image: Joi.string().optional(),
  level: Joi.string().optional(),
  category: Joi.string().optional(),
  courseType: Joi.object({
    type: Joi.string().optional(),
    price: Joi.number().optional(),
  }).optional(),
});

export { validateSchema, updateSchema };
