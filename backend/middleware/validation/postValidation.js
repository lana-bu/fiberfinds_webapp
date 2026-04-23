// validation/postValidation.js
import { body } from 'express-validator';

export const createOrEditPostRules = [
    body('type')
        .trim()
        .notEmpty().withMessage('Type is required')
        .isIn(['crochet', 'knitting', 'sewing', 'weaving', 'embroidery', 'other']).withMessage('Not a valid type'),
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ max: 100 }).withMessage('Title cannot be longer than 100 characters'),
    body('description')
        .optional({ values: 'falsy' })
        .trim()
        .isLength({ max: 500 }).withMessage('Description cannot be longer than 500 characters'),
    body('skill')
        .trim()
        .notEmpty().withMessage('Skill level is required')
        .isIn(['beginner', 'intermediate', 'advanced']).withMessage('Not a valid skill level'),
    body('creator')
        .trim()
        .notEmpty().withMessage('Pattern creator is required')
        .isLength({ max: 50 }).withMessage('Pattern creator cannot be longer than 50 characters'),
    body('uploadType')
        .trim()
        .notEmpty().withMessage('Upload type is required')
        .isIn(['link', 'file', 'both']).withMessage('Not a valid upload type'),
    body('link')
        .if(body('uploadType').isIn(['link', 'both']))
        .trim()
        .notEmpty().withMessage('Link is required')
        .isURL().withMessage('Not a valid URL'),
];
