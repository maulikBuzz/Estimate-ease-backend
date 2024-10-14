const { body, validationResult } = require('express-validator');
const User = require('../models').User;

const userSignupValidationRules = () => {
  return [
    body('name').notEmpty().withMessage('Name is required'),
    body('email')
      .isEmail().withMessage('Invalid email address')
      .custom(async (value, { req }) => {
        const admin = await User.findOne({ where: { email: value } });
        if (admin) {
          return Promise.reject('Email already exist');
        }
      }),
    body('password')
      .notEmpty().withMessage('Password is required').matches(/\d/)
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

    body('phone_number')
      .isMobilePhone()
      .withMessage('Please provide a valid contact number'),

    body('merchant_id')
      .isNumeric()
      .withMessage('Merchant ID must be a numeric value')
  ];
};

const loginValidationRules = () => {
  return [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password is required')
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  userSignupValidationRules,
  loginValidationRules,
  validate,
};
 