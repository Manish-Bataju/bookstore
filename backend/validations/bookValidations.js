import Joi from "joi";

export const bookJoiSchema = Joi.object({
  // 1. Strings - Using .allow("") for fields that might start empty
  title: Joi.string().required().trim(),
  description: Joi.string().allow("").trim(), 
  author: Joi.string().allow("").trim(),
  brand: Joi.string().allow("").trim(),
  isbnNo: Joi.string().allow("").trim(),
  edition: Joi.any(), // Since it's '0' or a string, .any() is safest

  // 2. The Category Object
  category: Joi.object({
    productType: Joi.string().allow("").required(),
    main: Joi.string().allow("").required(),
    subcategory: Joi.string().allow("").optional(),
  }).required(),

  // 3. Numbers - Joi will automatically convert your form strings to numbers
  margin: Joi.number().default(0),
  costPrice: Joi.number().min(0).default(0),
  discountAmount: Joi.number().min(0).default(0),
  rentalPrice: Joi.number().min(0).default(0),
  discountType: Joi.string().valid("Percentage", "Flat", "None").default("None"),

  // 4. Stock History - This matches your Frontend array exactly
  stockHistory: Joi.array().items(
    Joi.object({
      quantityReceived: Joi.number().default(0),
      unitCost: Joi.number().default(0)
    })
  ).optional(),

  // 5. Dimension Object (Matches your keys: height, width, thickness, weight)
  bookDimension: Joi.object({
    height: Joi.any().allow(""),
    width: Joi.any().allow(""),
    thickness: Joi.any().allow(""),
    weight: Joi.any().allow("")
  }).optional(),

  // 6. Booleans - Handles both real booleans and strings like "false"
  isForRent: Joi.any().default(false),
  
  // 7. Arrays
  tags: Joi.array().items(Joi.string()).default(['Best Seller']),

  // 8. Images - These are handled by Multer separately
  bookImage: Joi.any().optional(),

}).unknown(true); // Allow thumbnailPreview and other extra fields

export const updateBookJoiSchema = bookJoiSchema.fork(
  [
    "title",
    "category",
    "costPrice", // Now optional in the base schema anyway
    "margin",
    "stockHistory", // Updated from 'stock' to match your base schema
    "description",
    "bookImage",
    "edition",
  ],
  (schema) => schema.optional(),
);
