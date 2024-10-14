const MerchantProduct = require('../models').MerchantProduct;
const Merchant = require('../models').Merchant;
const Product = require('../models').Product;
const MerchantSubProduct = require('../models').MerchantSubProduct;
const SubProductUnit = require('../models').SubProductUnit;
const QuotationMaterial = require('../models').QuotationMaterial;


// insert Merchant Product
const addMerchantProduct = async (req, res) => {
    try {
        const { merchant_id, product_id } = req.body;

        const isExist = await MerchantProduct.findOne({ where: { merchant_id, product_id, is_active: true } });
        if (isExist) {
            return res.status(409).json({
                status: false,
                message: "This Merchant Product combination already exists. Please try another one."
            });
        }

        const newMerchantProduct = await MerchantProduct.create({ merchant_id, product_id });
        if (!newMerchantProduct) {
            return res.status(500).json({
                status: false,
                message: "Something went wrong while inserting Merchant Product data.",
                data: {}
            });
        }

        return res.status(201).json({
            status: true,
            message: "Merchant Product added successfully.",
            data: newMerchantProduct
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


const updateMerchantProduct = async (req, res) => {
    try {
        const { merchant_product_id } = req.query;
        const { merchant_id, product_id } = req.body;

        const updateData = { merchant_id, product_id }; 

        if (!merchant_product_id) {
            return res.status(400).json({
                status: false,
                message: "Merchant Product ID is required."
            });
        }

        const existingMerchantProduct = await MerchantProduct.findByPk(merchant_product_id);
        if (!existingMerchantProduct) {
            return res.status(404).json({
                status: false,
                message: "This Merchant Product does not exist. Please check the Merchant Product ID."
            });
        }

        const [affectedRows] = await MerchantProduct.update(updateData, { where: { id: merchant_product_id } });

        if (affectedRows === 0) {
            return res.status(400).json({
                status: false,
                message: "No changes were made to the Merchant Product data. Please check the provided information.",
                data: {}
            });
        }

        return res.status(200).json({
            status: true,
            message: "Merchant Product updated successfully.",
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


const getMerchantProductList = async (req, res) => {
    try {
        const { merchant_id } = req.query;
        
        const queryCondition = { where: { merchant_id } };

        const merchantProductList = await MerchantProduct.findAll({
            ...queryCondition,
            include: [{
                model: Product,
                as: 'products',
            },
            ]
        });
  
        if (merchantProductList.length === 0) {
            return res.status(404).json({
                status: false,
                message: "No merchant products found for the given criteria.",
                data: []
            });
        }
 
        return res.status(200).json({
            status: true,
            message: "Merchant product list retrieved successfully.",
            data: merchantProductList
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



const getMerchantProduct = async (req, res) => {
    try {
        const { merchant_product_id } = req.query;

        if (!merchant_product_id) {
            return res.status(400).json({
                status: false,
                message: "Merchant Product ID is required."
            });
        }

        const merchantProduct = await MerchantProduct.findByPk(merchant_product_id);

        if (!merchantProduct) {
            return res.status(404).json({
                status: false,
                message: "Merchant Product not found.",
                data: {}
            });
        }

        return res.status(200).json({
            status: true,
            message: "Merchant Product retrieved successfully.",
            data: merchantProduct
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

const deleteMerchantProduct = async (req, res) => {
    try {
        const { merchant_product_id } = req.query;

        if (!merchant_product_id) {
            return res.status(400).json({
                status: false,
                message: "Merchant Product ID is required."
            });
        }
 
        const MerchantSubProductData = await MerchantSubProduct.findAll({ where: { merchant_product_id: merchant_product_id } }); 
        const isExistSubProduct = MerchantSubProductData.map(async (item) => await QuotationMaterial.findAll({ where: { material_id: item.id } }))
  
        if (isExistSubProduct.length != 0) { 
            return res.status(400).json({
                status: false,
                message: "This product is currently in use and cannot be deleted.",
                data: {}
            });
    
        } 
        await Promise.all(MerchantSubProductData.map(item => SubProductUnit.destroy({ where: { sub_product_id: item.id } })));

        await MerchantSubProduct.destroy({ where: { merchant_product_id: merchant_product_id } });

        const deletedRows = await MerchantProduct.destroy({ where: { id: merchant_product_id } });

        if (deletedRows === 0) {
            return res.status(404).json({
                status: false,
                message: "This Merchant Product does not exist. Please check the Merchant Product ID."
            });
        }

        return res.status(200).json({
            status: true,
            message: "Merchant Product deleted successfully.",
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

const duplicateMerchant = async (req, res) => {
    try {
        let { merchant_product_id, product_id } = req.query;
   
        if (!merchant_product_id || !product_id) {
            return res.status(400).json({
                status: false,
                message: "Merchant Product ID and Product ID are required."
            });
        }

        const merchantProduct = await MerchantProduct.findByPk(merchant_product_id);
        
        if (!merchantProduct) {
            return res.status(404).json({
                status: false,
                message: "Merchant Product not found."
            });
        }

        const newMerchantProduct = await MerchantProduct.create({
            merchant_id: merchantProduct.merchant_id,
            product_id
        });

        if (!newMerchantProduct) {
            return res.status(500).json({
                status: false,
                message: "Failed to create new Merchant Product."
            });
        }

        const merchantSubProducts = await MerchantSubProduct.findAll({ where: { merchant_product_id } }); 
        await Promise.all(
            merchantSubProducts.map(async (subProduct) => {
                const units = await SubProductUnit.findAll({ where: { sub_product_id: subProduct.id } });
                const unitIds = units.map(unit => unit.unit_id);

                const existingSubProduct = await MerchantSubProduct.findOne({
                    where: {
                        merchant_id: merchantProduct.merchant_id,
                        merchant_product_id: newMerchantProduct.id,
                        name: subProduct.name,
                        is_active: true
                    }
                });

                if (existingSubProduct) {
                    throw new Error(`Duplicate Sub Product: ${subProduct.name} already exists.`);
                }

                const newSubProduct = await MerchantSubProduct.create({
                    merchant_id: merchantProduct.merchant_id,
                    merchant_product_id: newMerchantProduct.id,
                    name: subProduct.name,
                    price: subProduct.price
                });

                if (!newSubProduct) {
                    throw new Error(`Failed to create Sub Product: ${subProduct.name}`);
                }

                await SubProductUnit.bulkCreate(
                    unitIds.map(unit_id => ({
                        unit_id,
                        sub_product_id: newSubProduct.id
                    }))
                );
            })
        );

        return res.status(200).json({
            status: true,
            message: "Merchant Product duplicated successfully."
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



module.exports = {
    addMerchantProduct,
    getMerchantProductList,
    getMerchantProduct,
    deleteMerchantProduct,
    updateMerchantProduct,
    duplicateMerchant
}