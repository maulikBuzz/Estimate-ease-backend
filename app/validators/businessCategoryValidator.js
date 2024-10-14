const { body } = require('express-validator');

const businessCategoryValidation = () => {
    return [
        body('name').notEmpty().withMessage('Name is required'),
    ];
};

module.exports = {
    businessCategoryValidation
};
