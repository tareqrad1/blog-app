const Joi = require('joi');

const registerSchema = Joi.object({
    username: Joi.string().required().messages({
        'string.empty': `Username cannot be an empty field`,
    }),
    email: Joi.string().trim().lowercase().email({tlds: { allow: ['com', 'net'] }}).required().messages({
        'string.empty': `Email cannot be an empty field`,
        'string.email': ` Email must be a valid email address`
    }),
    password: Joi.string().min(6).max(20).required().label('password').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/).messages({
        "string.empty": "Password cannot be an empty field",
        "string.min": "Password Must have at least 6 characters",
        "string.pattern.base": "Must have a Strong Password",
    }),
    confirmPassword: Joi.any().equal(Joi.ref('password'))
    .required()
    .messages({ 'any.only': 'Confirm password does not match' })
})

const updateSchema = Joi.object({
    username: Joi.string().messages({
        'string.empty': `Username cannot be an empty field`,
    }),
    email: Joi.string().trim().lowercase().email({tlds: { allow: ['com', 'net'] }}).messages({
        'string.empty': `Email cannot be an empty field`,
        'string.email': ` Email must be a valid email address`
    }),
    password: Joi.string().min(6).max(20).label('password').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/).messages({
        "string.empty": "Password cannot be an empty field",
        "string.min": "Password Must have at least 6 characters",
        "string.pattern.base": "Must have a Strong Password",
    }),
    confirmPassword: Joi.any().equal(Joi.ref('password'))
    .messages({ 'any.only': 'Confirm password does not match' }),
    bio: Joi.string()
});


module.exports = {
    registerSchema,
    updateSchema,
}