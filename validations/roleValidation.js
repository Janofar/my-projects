const Joi = require('joi');

const roleAddSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    permissions: Joi.array().items(Joi.string()).optional(),
});

module.exports = {
    roleAddSchema,
};
