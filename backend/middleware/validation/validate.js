import { validationResult } from 'express-validator';

export const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const formattedErrors = {};

        // group errors by field name
        errors.array().forEach(error => {
            if (!formattedErrors[error.path]) {
                formattedErrors[error.path] = [];
            }

            formattedErrors[error.path].push(error.msg);
        });

        return res.status(400).json({ success: false, message: "Validation failed", errors: formattedErrors });
    }

    next();
};