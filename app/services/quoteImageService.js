const QuotationImage = require('../models').QuotationImage;

const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});


const deleteQuotationImages = async (quotation_item_id) => {
    try {
        const quotationImagesData = await getQuotationImages({ quote_item_id: quotation_item_id })

        quotationImagesData.data.map((item) => {
            const imagePath = path.join(__dirname, "..", "..", "public", item.dataValues.image_url);
            if (fs.existsSync(imagePath)) {
                fs.unlink(imagePath, (err) => {
                    if (err) {
                        console.error('Error deleting the image:', err);
                        return;
                    }
                    console.log('Image deleted successfully');
                });
            } else {
                const params = {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: item.dataValues.image_url
                };

                s3.deleteObject(params, (err, data) => {
                    if (err) {
                        console.error('Error deleting the file:', err);
                        return;
                    }
                    console.log('File deleted successfully:', data);
                });
            }
        })

        await QuotationImage.destroy({ where: { quote_item_id: quotation_item_id } })

        return ({
            status: true,
            message: "Customer added successfully.",
            data: {}
        });
    } catch (error) {
        console.error(error);
        return ({
            status: false,
            message: "An error occurred. Please try again.",
            error: error.message
        })
    }
};
const deleteQuotationImage = async (id) => {
    try {
        const queryCondition = { where: { id } }
        const quotationImagesData = await QuotationImage.findOne({
            ...queryCondition
        });

        if (!quotationImagesData || quotationImagesData.length === 0) {
            return {
                status: false,
                message: "No quotation item data found for the provided quote ID.",
                data: {}
            };
        }
 
        const imagePath = path.join(__dirname, "..", "..", "public", quotationImagesData.image_url);
        if (fs.existsSync(imagePath)) {
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error('Error deleting the image:', err);
                    return;
                }
                console.log('Image deleted successfully');
            });
        } else {
            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: quotationImagesData.image_url
            };

            s3.deleteObject(params, (err, data) => {
                if (err) {
                    console.error('Error deleting the file:', err);
                    return;
                }
                console.log('File deleted successfully:', data);
            });
        }

        await QuotationImage.destroy({ where: {  id } })

        return ({
            status: true,
            message: "Customer added successfully.",
            data: {}
        });
    } catch (error) {
        console.error(error);
        return ({
            status: false,
            message: "An error occurred. Please try again.",
            error: error.message
        })
    }
};

const getQuotationImages = async (data) => {
    try {
        const { quote_item_id } = data;

        const queryCondition = { where: { quote_item_id } }
        const quotationImagesData = await QuotationImage.findAll({
            ...queryCondition
        });

        if (!quotationImagesData || quotationImagesData.length === 0) {
            return {
                status: false,
                message: "No quotation item data found for the provided quote ID.",
                data: []
            };
        }

        return {
            status: true,
            message: "Quotation Images data retrieved successfully.",
            data: quotationImagesData
        };
    } catch (error) {
        console.error(error);
        return ({
            status: false,
            message: "An error occurred. Please try again.",
            error: error.message
        });
    }
};

const addQuotationImages = async ({ quote_item_id, image_url }) => {
    try {
        const newQuotationImages = await QuotationImage.create({
            quote_item_id: quote_item_id,
            image_url: image_url
        });

        if (!newQuotationImages || newQuotationImages.length === 0) {
            return {
                status: false,
                message: "No quotation item data found for the provided quote ID.",
                data: []
            };
        }

        return {
            status: true,
            message: "Quotation Images data retrieved successfully.",
            data: newQuotationImages
        };
    } catch (error) {
        console.error(error);
        return ({
            status: false,
            message: "An error occurred. Please try again.",
            error: error.message
        });
    }
};

module.exports = {
    deleteQuotationImages,
    getQuotationImages,
    addQuotationImages,
    deleteQuotationImage
}

