const Joi = require('joi');

module.exports = (schema, source = 'body') => {
    return (req, res, next) => {
        let data;

        if (source === 'body') {
            data = req.body;
        } else if (source === 'params') {
            data = req.params;
        } else if (source === 'query') {
            data = req.query;
        } else {
            return res.status(400).json({ message: "Invalid validation source specified" });
        }

        const { error } = schema.validate(data, { abortEarly: false });

        if (error) {
            error.isJoi = true;
            return next(error);
        }

        next();
    };
};
