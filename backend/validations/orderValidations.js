import Joi from "joi";

export const orderJoiSchema = Joi.object({

    items: Joi.array().items(
        Joi.object({
            book: Joi.string().hex().length(24).required().messages({
                'string.empty': "Book Id is required",
                'string.length': 'Invalid Book ID format'
            }),
            quantity: Joi.number().integer().min(1).required().messages({
                'number.min': "Minimum quantity must be 1",
                'any.required': "Quantity is required"})
        })
    ).min(1).required(),

    //shipping & address & payment Method
    paymentMethod: Joi.string().valid('E-sewa', 'IME-Khalti', 'COD').required(),
    shippingAddress: Joi.object({
        street: Joi.string().required(),
        city: Joi.string().required(),
        postCode:Joi.string().required(),
        landMark:Joi.string().allow('', null)
    }).required(),
    shippingFee:Joi.number().min(0).default(0)
});


export const updateStatusJoiSchema = Joi.object({
    status: Joi.string()
        .valid("Pending", "Processing", "Shipped", "Delivered", "Cancelled")
        .required()
        .messages({
            'any.only': 'Invalid order status. Must be Pending, Processing, Shipped, Delivered, or Cancelled'
        })
});