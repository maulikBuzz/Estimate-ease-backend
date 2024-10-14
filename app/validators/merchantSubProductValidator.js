const { body } = require('express-validator');

const merchantSubProductValidation = () => {
  return [
    body('merchant_id')
      .optional()
      .isInt().withMessage('Merchant ID must be an integer'),

    body('merchant_product_id')
      .optional()
      .isInt().withMessage('Merchant Product ID must be an integer'),

    body('name')
      .optional()
      .notEmpty().withMessage('Name cannot be empty'),
    body().custom(body => {
      if (!body.merchant_id && (!body.merchant_product_id || !body.name)) {
        throw new Error('Either Merchant ID must be present or both Merchant Product ID and Name must be provided');
      }
      return true;
    }),
  ];
};

module.exports = {
  merchantSubProductValidation
};
