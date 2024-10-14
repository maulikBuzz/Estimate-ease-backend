const QuotationMaterial = require('../models').QuotationMaterial;
const MerchantSubProduct = require('../models').MerchantSubProduct;
const SubProductUnit = require('../models').SubProductUnit;
const Unit = require('../models').Unit;

const addMerchantSubProduct = async (req, res) => {
    try {
        let { merchant_id, merchant_product_id, name, price, unit_id } = req.body;

        const existingSubProduct = await MerchantSubProduct.findOne({
            where: { merchant_id, merchant_product_id, name, is_active: true }
        });
        if (existingSubProduct) {
            return res.status(409).json({
                status: false,
                message: "This Merchant Sub Product already exists. Please try another one."
            });
        }

        const newSubProduct = await MerchantSubProduct.create({ merchant_id, merchant_product_id, name, price });
        if (!newSubProduct) {
            return res.status(500).json({
                status: false,
                message: "Something went wrong while inserting Merchant Sub Product data.",
                data: {}
            });
        }
        let merchantSubProductsUnit = [];
        const sub_product_id = newSubProduct.id;

        if (unit_id && unit_id.length > 0) {
            for (const item of unit_id) { 
                let unitData = await SubProductUnit.create({ unit_id: item, sub_product_id });
                if (unitData) {
                    const queryCondition = { where: { id: unitData.id } }
                    const subProductUnitData = await SubProductUnit.findOne({
                        ...queryCondition, include: [{
                            model: Unit,
                            as: 'units',
                        },
                        ]
                    });
                  
                    const data = {
                        "id": unitData.id,
                        "unit_id": unitData.unit_id,
                        "sub_product_id": unitData.sub_product_id,
                        "units": subProductUnitData.units
                    }
                    merchantSubProductsUnit.push(data);
                }
            }
        } 
        newSubProduct.SubProductUnits = merchantSubProductsUnit
      
        return res.status(201).json({
            status: true,
            message: "Merchant Sub Product added successfully.",
            data: newSubProduct,
            SubProductUnits: merchantSubProductsUnit
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

const updateMerchantSubProduct = async (req, res) => {
    try {
        const { merchant_sub_product_id } = req.query;
        let { name, price } = req.body;

        const updates = {  name, price };

        if (!merchant_sub_product_id) {
            return res.status(400).json({
                status: false,
                message: "Merchant Sub Product ID is required."
            });
        }

        const existingSubProduct = await MerchantSubProduct.findByPk(merchant_sub_product_id);
        if (!existingSubProduct) {
            return res.status(404).json({
                status: false,
                message: "This Merchant Sub Product does not exist. Please check the Merchant Sub Product ID."
            });
        }

        const [affectedRows] = await MerchantSubProduct.update(updates, {
            where: { id: merchant_sub_product_id }
        });

        if (affectedRows === 0) {
            return res.status(400).json({
                status: false,
                message: "No changes were made to the Merchant Sub Product data. Please check the provided information.",
                data: {}
            });
        }
        const sub_product_id = merchant_sub_product_id 
        
        const queryCondition = sub_product_id ? { where: { sub_product_id } } : {};
        const units = await SubProductUnit.findAll({
            ...queryCondition, include: [{
                model: Unit,
                as: 'units',
            },
            ]
        });  

        const currentUnits = units.map(unit => unit.unit_id);
 
        const unitsToCreate = updates.unit_id.filter(unitId => !currentUnits.includes(unitId));
        const unitsToDelete = currentUnits.filter(unitId => !updates.unit_id.includes(unitId));
     
        for (const unitId of unitsToCreate) {
          await SubProductUnit.create({
            sub_product_id: merchant_sub_product_id,
            unit_id: unitId,
             
          });
        }
     
        for (const unitId of unitsToDelete) {
          await SubProductUnit.destroy({
            where: {
              sub_product_id: merchant_sub_product_id,
              unit_id: unitId
            }
          });
        }
 
        return res.status(200).json({
            status: true,
            message: "Merchant Sub Product updated successfully.",
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


const getMerchantSubProductList = async (req, res) => {
    try {
        const { merchant_product_id } = req.query;

        const queryCondition = merchant_product_id ? { where: { merchant_product_id } } : {};

        const merchantSubProducts = await MerchantSubProduct.findAll({
            ...queryCondition,
            include: [{
                model: SubProductUnit,
                as: 'SubProductUnits',
                include: [
                    {
                        model: Unit,
                        as: 'units'
                    }
                ]
            }]
        });

        if (merchantSubProducts.length === 0) {
            return res.status(404).json({
                status: false,
                message: "No Merchant Sub Products found for the given Merchant ID.",
                data: []
            });
        }

        return res.status(200).json({
            status: true,
            message: "Merchant Sub Product list retrieved successfully.",
            data: merchantSubProducts
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: "An error occurred while retrieving Merchant Sub Products.",
            error: error.message
        });
    }
};

const getMerchantSubProduct = async (req, res) => {
    try {
        const { merchant_sub_product_id } = req.query;

        if (!merchant_sub_product_id) {
            return res.status(400).json({
                status: false,
                message: "Merchant Sub Product ID is required.",
                data: {}
            });
        }

        const merchantSubProduct = await MerchantSubProduct.findByPk(merchant_sub_product_id, {
            include: [{
                model: SubProductUnit,
                as: 'SubProductUnits'
            }]
        });

        if (!merchantSubProduct) {
            return res.status(404).json({
                status: false,
                message: "Merchant Sub Product data not found.",
                data: {}
            });
        }

        return res.status(200).json({
            status: true,
            message: "Merchant Sub Product retrieved successfully.",
            data: merchantSubProduct
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


const deleteMerchantSubProduct = async (req, res) => {
    try {
        const { merchant_sub_product_id } = req.query;

        if (!merchant_sub_product_id) {
            return res.status(400).json({
                status: false,
                message: "Merchant Sub Product ID is required.",
                data: {}
            });
        }

        const isExistSubProduct = await QuotationMaterial.findAll({ where: { material_id: merchant_sub_product_id } })
      
        if (isExistSubProduct.length != 0) { 
            return res.status(400).json({
                status: false,
                message: "This product is currently in use and cannot be deleted.",
                data: {}
            }); 
        } 

        await SubProductUnit.destroy({ where: { sub_product_id: merchant_sub_product_id } });

        const affectedRows = await MerchantSubProduct.destroy({ where: { id: merchant_sub_product_id } });

        if (affectedRows === 0) {
            return res.status(404).json({
                status: false,
                message: "This Merchant Sub Product does not exist. Please check the Merchant Sub Product ID.",
                data: {}
            });
        }

        return res.status(200).json({
            status: true,
            message: "Merchant Sub Product deleted successfully.",
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


module.exports = {
    addMerchantSubProduct,
    getMerchantSubProductList,
    getMerchantSubProduct,
    deleteMerchantSubProduct,
    updateMerchantSubProduct
}