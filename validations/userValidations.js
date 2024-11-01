const Joi = require('joi');

const objectIdSchema = Joi.object({
    id: Joi.string().hex().length(24).required(),
});

const registerSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    roleName: Joi.string().optional(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

const updateUserSchema = Joi.object({
    name: Joi.string().min(3).max(30).optional(),
    email: Joi.string().email().optional(),
    roleName: Joi.string().optional(),
});

const deleteUserSchema = objectIdSchema;

module.exports = {
    registerSchema,
    loginSchema,
    userIdSchema: objectIdSchema,
    updateUserSchema,
    deleteUserSchema,
};
