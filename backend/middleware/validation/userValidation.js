import { body, validationResult } from 'express-validator';

export const registerUserRules = [
    // validate username
    body('username')
    .notEmpty().withMessage('Username is required')
    .trim() // remove leading and trailing whitespace
    .custom(value => !/\s/.test(value)).withMessage('No spaces are allowed in your password')
    .isLength({ min: 2, max: 30}).withMessage('Username must be between 2 and 30 characters long'),

    // validate email
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage("Invalid email format")
        .normalizeEmail(), // trims whitespace and other email normalization

    // validate password
    body('password')
        .notEmpty().withMessage('Password is required')
        .custom(value => !/\s/.test(value)).withMessage('No spaces are allowed in your password')
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
        .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
        .matches(/[0-9]/).withMessage("Password must contain at least one number"),
]

export const validateUser = (req, res, next) => {
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

