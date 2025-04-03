import Joi from "joi";

export const validateSchema = Joi.object({
    title : Joi.string().required(),
    description : Joi.string().required(),
})