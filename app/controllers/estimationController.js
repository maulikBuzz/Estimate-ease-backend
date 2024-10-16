const Estimate = require("../services/estimateService")
const QuotationImages = require("../services/quoteImageService")
const QuotationItem = require('../models').QuotationItem;
const QuotationMaterial = require('../models').QuotationMaterial;
const QuotationDetail = require('../models').QuotationDetail;
const QuotationImage = require('../models').QuotationImage;
const Customer = require('../models').Customer;
const uploadImage = require('../helper/uploads')
const { body, validationResult } = require('express-validator');

const addEstimate = async (req, res) => {
    const storageType = req.query.storage || 'local'; // Use 's3' or 'local'

    const upload = uploadImage(storageType);

    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({
                status: false,
                message: "Image upload failed. Please try again.",
                error: err.message
            });
        }  

        await body('name')
            .notEmpty().withMessage('Name is required')
            .isString().withMessage('Name must be a string')
            .run(req);

        await body('address')
            .notEmpty().withMessage('Address is required')
            .isString().withMessage('Address must be a string')
            .run(req);

        await body('contact_no')
            .notEmpty().withMessage('Contact number is required')
            .isMobilePhone().withMessage('Contact number must be a valid phone number')
            .run(req);

        await body('quote_by')
            .notEmpty().withMessage('Quote By is required')
            .isString().withMessage('Quote By must be a string')
            .run(req);

        await body('quotationItems')
            .notEmpty().withMessage('Quotation items are required')
            .isString().withMessage('Quotation items must be an array')
            .run(req);

        await body('sales_rep')
            .optional()
            .isString().withMessage('Sales Rep must be a string if provided')
            .run(req);
 
        const errors = validationResult(req);
 
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
  
        try {
            let body = req.body;
            const files = req.files;
 
            if (body.quotationItems) {
                body.quotationItems = JSON.parse(body.quotationItems);
            } else {
                return res.status(400).json({
                    status: false,
                    message: "Quotation items are required.",
                    data: {}
                });
            }

            const user_id = req.id;
            body.created_by = user_id;

            const newEstimate = await Estimate.createEstimate({ body, files, storageType });
            if (!newEstimate.status) {
                return res.status(400).json({
                    status: false,
                    message: newEstimate.message,
                    data: {}
                });
            }
            return res.status(201).json({
                status: true,
                message: "Estimate added successfully.",
                data: newEstimate.data  
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: false,
                message: "An error occurred. Please try again.",
                error: error.message
            });
        }
    });
};

const editEstimate = async (req, res) => {
    const storageType = req.query.storage || 'local';
 
    const { user_customer_id } = req.query

    const upload = uploadImage(storageType);

    upload(req, res, async (err) => {
        
        await body('name')
            .notEmpty().withMessage('Name is required')
            .isString().withMessage('Name must be a string')
            .run(req);

        await body('address')
            .notEmpty().withMessage('Address is required')
            .isString().withMessage('Address must be a string')
            .run(req);

        await body('contact_no')
            .notEmpty().withMessage('Contact number is required')
            .isMobilePhone().withMessage('Contact number must be a valid phone number')
            .run(req);

        await body('quote_by')
            .notEmpty().withMessage('Quote By is required')
            .isString().withMessage('Quote By must be a string')
            .run(req);

        await body('quotationItems')
            .notEmpty().withMessage('Quotation items are required')
            .isString().withMessage('Quotation items must be an array')
            .run(req);

        await body('sales_rep')
            .optional()
            .isString().withMessage('Sales Rep must be a string if provided')
            .run(req);
 
        const errors = validationResult(req);
 
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
 
        try {
            let body = req.body

            const files = req.files
 
            const user_id = req.id
            body.quotationItems = JSON.parse(body.quotationItems)

            body.created_by = user_id

            const newEstimate = await Estimate.updateEstimate({ body, user_customer_id, files, storageType })
            if (!newEstimate.status) {
                return res.status(400).json({
                    status: false,
                    message: newEstimate.message,
                    data: {}
                });
            }

            return res.status(201).json({
                status: true,
                message: "Estimate updated successfully.",
                data: newEstimate.data
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: false,
                message: "An error occurred. Please try again.",
                error: error.message
            });
        }
    }) 
};

const deleteQuotationImage = async (req, res) => {
    try {
        const { quotation_image_id } = req.query
 
        const deleteQuotationImage = await QuotationImages.deleteQuotationImage(quotation_image_id)
        if (!deleteQuotationImage) {
            return res.status(400).json({
                status: false,
                message: "QuotationItem not found",
                data: {}
            });
        }

        return res.status(201).json({
            status: true,
            message: "QuotationItem deleted successfully.",
            data: {}
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: "An error occurred. Please try again.",
            error: error.message
        });
    }
};
const deleteQuotationItem = async (req, res) => {
    try {
        const { quotation_item_id } = req.query

        await QuotationMaterial.destroy({ where: { quote_item_id: quotation_item_id } })

        const deleteQuotationItem = await QuotationItem.destroy({ where: { id: quotation_item_id } })
        if (!deleteQuotationItem) {
            return res.status(400).json({
                status: false,
                message: "QuotationItem not found",
                data: {}
            });
        }

        return res.status(201).json({
            status: true,
            message: "QuotationItem deleted successfully.",
            data: "deleteQuotationItem.data"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: "An error occurred. Please try again.",
            error: error.message
        });
    }
};

const deleteEstimate = async (req, res) => {
    try {
        const { customer_id } = req.query;

        const existingCustomer = await QuotationDetail.findOne({ where: { customer_id: customer_id } });

        if (!existingCustomer) {
            return res.status(404).json({
                status: false,
                message: "Customer not found.",
                data: {}
            });
        }

        const existQuotationItem = await QuotationItem.findAll({ where: { quote_id: existingCustomer.id } });
        if (existQuotationItem.length != 0) {
            for (let i = 0; i < existQuotationItem.length; i++) {
                const element = existQuotationItem[i];
 

                await QuotationMaterial.destroy({ where: { quote_item_id: element.id } });
                    // const deleteQuotationImages = await QuotationImage.destroy({ where: { quote_item_id: quotation_item_id } })
                const deleteQuotationImages = await QuotationImages.deleteQuotationImages(element.id)

                const deleteQuotationItem = await QuotationItem.destroy({ where: { id: element.id } });

                if (deleteQuotationItem === 0) {
                    return res.status(404).json({
                        status: false,
                        message: "Quotation item not found.",
                        data: {}
                    });
                }
            }
        }

        const deleteQuotationResult = await QuotationDetail.destroy({ where: { customer_id } });

        if (!deleteQuotationResult) {
            return res.status(404).json({
                status: false,
                message: "Quotation detail not found or deleted.",
                data: {}
            });
        }

        const deleteCustomerResult = await Customer.destroy({ where: { id: customer_id } });
        if (!deleteCustomerResult) {
            return res.status(404).json({
                status: false,
                message: "customer not found or deleted.",
                data: {}
            });
        }

        return res.status(200).json({
            status: true,
            message: "Quotation item deleted successfully.",
            data: "existQuotationItem"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: "An error occurred. Please try again.",
            error: error.message
        });
    }

};

const getEstimate = async (req, res) => {
    try {
        let { user_customer_id, merchant_product_id } = req.query

        const estimateData = await Estimate.getEstimate({ user_customer_id, merchant_product_id })
        if (!estimateData.status) {
            return res.status(400).json({
                status: false,
                message: estimateData.message,
                data: {}
            });
        }

        return res.status(201).json({
            status: true,
            message: "Estimate List.",
            data: estimateData.data
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: "An error occurred. Please try again.",
            error: error.message
        });
    }
};

const getEstimateCustomerList = async (req, res) => {
    try {
        let { merchant_id } = req.query

        const estimateData = await Estimate.getEstimateCustomerList({ merchant_id })
        if (!estimateData.status) {
            return res.status(400).json({
                status: false,
                message: estimateData.message,
                data: []
            });
        }

        return res.status(201).json({
            status: true,
            message: "Estimate customer list.",
            data: estimateData.data
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: "An error occurred. Please try again.",
            error: error.message
        });
    }
};
const generatePdf = async (req, res) => {
    try {
        let { user_customer_id } = req.query
        const user_id = req.id

        const pdfData = await Estimate.generatePdf({ user_customer_id, user_id }) 
          
        const fileName = pdfData.name + ".pdf"
        console.log(fileName);
        const customFileName = 'hello.pdf';
        console.log(customFileName);

        // res.setHeader('Content-Type', 'application/pdf');
        // res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        // res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
        res.status(200).json(pdfData);


    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: "An error occurred. Please try again.",
            error: error.message
        });
    }
};

module.exports = {
    addEstimate,
    getEstimate,
    getEstimateCustomerList,
    editEstimate,
    deleteQuotationItem,
    deleteEstimate,
    generatePdf,
    deleteQuotationImage
}