import { validationResult } from 'express-validator';

export const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // Group errors by field name
        const formattedErrors = {};

        errors.array().forEach(error => {
            if (!formattedErrors[error.path]) {
                formattedErrors[error.path] = [];
            }

            formattedErrors[error.path].push(error.msg);
        });

        return res.status(400).json({ 
            success: false,
            message: "Validation failed",
            errors: formattedErrors
        });
    }

    next();
};