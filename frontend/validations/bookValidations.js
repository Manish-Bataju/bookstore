import Joi from "joi";

export const bookJoiSchema = Joi.object({
  title: Joi.string().required().trim().messages({
    "string.empty": "title can not be empty",
  }),

  category: Joi.object({
    main: Joi.string().hex().length(24).required().messages({
      "any.required": "Main Cate4gory ID is required",
      "string.length": "invalid main category ID format",
    }),
    subcategory: Joi.string().hex().length(24).required().messages({
      "any.required": "sub-category is required",
      "string.length": "invalid sub category length",
    }),
  }).required(),

  //financial
  costPrice: Joi.number().required().min(0).messages({
    "number.base": "Cost price must be a number",
    "number.min": "Cost Price can not be negative",
  }),
  margin: Joi.number().min(0).required().messages({
    "number.base": "Margin must be a number",
    "number.min": "Margin can not be negative",
  }),

  stock: Joi.number().min(1).required().messages({}),
  edition: Joi.string().trim().required(),
  isbnNo: Joi.string().trim().allow("", null),

  description: Joi.string().required().trim().messages({
    "string.empty": "Description can not be empty",
  }),

  bookImage: Joi.array()
    .items(
      Joi.string()
        .uri()
        .pattern(/\.(jpg|jpeg|png|webp|avif)$/i),
    )
    .min(1)
    .required()
    .messages({
      "array.min": "At least 1 book image is required",
      "string.pattern.base": "images must be in JPG, PNG or webp format",
      "string.uri": "invalid Image url format",
    }),
});

export const updateBookJoiSchema = bookJoiSchema.fork(
  [
    "title",
    "category",
    "costPrice",
    "margin",
    "stock",
    "description",
    "bookImage",
  ],
  (schema) => schema.optional(),
);
