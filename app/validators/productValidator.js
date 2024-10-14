const { body } = require('express-validator');

const productValidation = () => {
  return [
    body('name')
      .optional()
      .notEmpty().withMessage('Name cannot be empty'),

    body('business_category_id')
      .optional()
      .isInt().withMessage('Business Category ID must be an integer'),

    body().custom(body => {
      if (!body.name && !body.business_category_id) {
        throw new Error('Either Name or Business Category ID is required');
      }
      return true;
    }),
  ];
};

module.exports = {
  productValidation
};
