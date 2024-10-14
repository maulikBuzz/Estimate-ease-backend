const {body, param } = require('express-validator'); 

const merchantValidation = () => {
  return [
    body('name')
      .notEmpty().withMessage('Name is required'),

    body('business_category_id')
      .notEmpty().withMessage('Business Category ID is required')
      .isInt().withMessage('Business Category ID must be an integer'),

    body('address')
      .notEmpty().withMessage('Address is required'),

    body('city')
      .notEmpty().withMessage('City is required'),

    body('state')
      .notEmpty().withMessage('State is required') 
  ];
};
 

module.exports = {
  merchantValidation 
};
