const { body } = require('express-validator');

const customerValidation = () => {
  return [
    body('name')
      .optional()
      .notEmpty().withMessage('Name cannot be empty'),

    body('address')
      .optional()
      .notEmpty().withMessage('Address cannot be empty'),

    body('contact_no')
      .optional()
      .matches(/^[0-9]{10}$/).withMessage('Contact number must be a valid 10-digit number'),

    body().custom(body => {
      if (!body.name && !body.address && !body.contact_no) {
        throw new Error('At least one of Name, Address, or Contact Number is required');
      }
      return true;
    }),
  ];
};

module.exports = {
  customerValidation
};
