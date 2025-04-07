import Joi from "joi";

const validateSchema = Joi.object({
  appliedBy: Joi.string().required(),
  studentName: Joi.string().min(3).required(),
  studentAddress: Joi.string().min(3).required(),
  phone: Joi.number().length(11).pattern(/^\d+$/).required(),
  studentCnic: Joi.string()
    .length(15)
    .pattern(/^\d{5}-\d{7}-\d{1}$/)
    .required(),
  institute: Joi.string().required(),
});

export { validateSchema };
