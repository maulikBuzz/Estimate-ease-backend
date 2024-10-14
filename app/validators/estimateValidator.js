const { body } = require('express-validator');

const validateQuotation = () => {
    return [
        body('name')
            .notEmpty().withMessage('Name is required')
            .isString().withMessage('Name must be a string'),

        body('address')
            .notEmpty().withMessage('Address is required')
            .isString().withMessage('Address must be a string'),

        body('contact_no')
            .notEmpty().withMessage('Contact number is required')
            .isMobilePhone().withMessage('Contact number must be a valid phone number'),

        body('quote_by')
            .notEmpty().withMessage('Quote By is required')
            .isString().withMessage('Quote By must be a string'),
  
        body('quotationItems')
            .notEmpty().withMessage('Quotation items are required')
            .isArray().withMessage('Quotation items must be an array'),

        body('merchant_id')
            .notEmpty().withMessage('Merchant ID is required')
            .isNumeric().withMessage('Merchant ID must be a number'),

        body('sales_rep')
            .optional()
            .isString().withMessage('Sales Rep must be a string if provided'),
    ];
};

module.exports = { validateQuotation }
