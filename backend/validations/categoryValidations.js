import Joi from "joi";

export const categoryJoiSchema = Joi.object({
  name: Joi.string().required().trim().messages({
    "string.empty": "Category name is required",
  }),
  parentCategory: Joi.string().hex().length(24).allow("", null).messages({
    "string.length": "Invalid Parent Category ID format",
  }),

  description: Joi.string().required().allow("", null),
});
