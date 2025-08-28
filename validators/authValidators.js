const { body } = require('express-validator');

exports.registerValidator = [
  body('name')
    .notEmpty().withMessage('name is required')
    .isLength({ min: 3 }).withMessage('name must be at least 3 characters'),

  body('email')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

exports.loginValidator = [
  body('email')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required')
];
