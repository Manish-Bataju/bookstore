import Joi from "joi";

export const userJoiSchema = Joi.object({
    firstName: Joi.string().required().trim().messages({'string.empty': 'First name is required'}),
    middleName: Joi.string().trim().allow('', null),
    lastName: Joi.string().required().trim().messages({'string.empty': 'Last name is required'}),
    email:Joi.string().email().required().lowercase().messages({'string.email': 'Please provide a valid email address'}),
    password:Joi.string().min(8).required().messages({'string.min': 'Password must be at least 8 characters long'}),
    mobileNo:Joi.string().required().length(10).pattern(/^[0-9]+$/).messages({
        'string.pattern.base': 'Mobile no must contain only digits.',
        'string.length': "Mobile no must be exactly 10 digits"}),
    role:Joi.string().valid('user', 'admin').default('user'),

    // --- Conditional Shop Logic ---
    shopName: Joi.string().when('role', {
        is:'admin',
        then:Joi.string().required().messages({
            'any.required': 'Shop name is required for sellers',
            'string.empty': 'Shop name can not be empty'}),
        otherwise:Joi.string().allow('', null)}),

    panNumber: Joi.string().when('role', {
        is:'admin',
        then:Joi.string().length(9).required().messages({
            'string.length': "PAN number must be exactly 9 digits",
            'any.required': 'PAN number is required for sellers'}),
        otherwise:Joi.string().allow('', null)
    })
});