import Joi from "joi";

const validateInstitute = Joi.object({
  instituteName: Joi.string().min(3).required(),
  instituteAddress: Joi.string().min(3).required(),
  phone: Joi.string().length(11).pattern(/^\d+$/).required(),
  ownerCnic: Joi.string()
    .length(15)
    .pattern(/^\d{5}-\d{7}-\d{1}$/)
    .required(),
  approvedByAdmin: Joi.boolean().default(false),
  instituteLogo: Joi.string().optional(),
  createdBy: Joi.string().required(),
});

const updateValidaation = Joi.object({
  instituteName: Joi.string().min(3).optional(),
  instituteAddress: Joi.string().min(3).optional(),
  phone: Joi.string().length(11).pattern(/^\d+$/).optional(),
  instituteLogo: Joi.string().optional(),
});

export { validateInstitute, updateValidaation };
