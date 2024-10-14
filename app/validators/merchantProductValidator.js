const { body } = require('express-validator');

const merchantProductValidation = () => {
  return [
    body('merchant_id')
      .optional()
      .isInt().withMessage('Merchant ID must be an integer'),

    body('product_id')
      .optional()
      .isInt().withMessage('Product ID must be an integer'),
    body().custom(body => {
      if (!body.merchant_id && !body.product_id) {
        throw new Error('Either Merchant ID or Product ID is required');
      }
      return true;
    }),
  ];
};

module.exports = {
  merchantProductValidation
};
