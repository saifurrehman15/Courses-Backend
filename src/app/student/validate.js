import Joi from "joi";

const validateSchema = Joi.object({
  appliedBy: Joi.string().required(),
  studentName: Joi.string().min(3).required(),
  studentAddress: Joi.string().min(3).required(),
  phone: Joi.string().length(11).pattern(/^\d+$/).required(),
  studentCnic: Joi.string()
    .length(15)
    .pattern(/^\d{5}-\d{7}-\d{1}$/)
    .required(),
  institute: Joi.string().required(),
  status: Joi.string()
    .valid("pending", "approved", "reject")
    .default("pending"),
});

const validateUpdate = Joi.object({
  studentCnic: Joi.string().forbidden(),
  appliedBy: Joi.string().forbidden(),
  phone: Joi.string().forbidden(),
  status: Joi.string()
    .valid("pending", "approved", "reject")
    .default("pending"),
});

export { validateSchema, validateUpdate };
