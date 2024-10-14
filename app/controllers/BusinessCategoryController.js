const BusinessCategory = require('../models').BusinessCategory;

const addBusinessCategory = async (req, res) => {
    try {
        const { name } = req.body; 

        const isExist = await BusinessCategory.findOne({ where: { name } });
        if (isExist) {
            return res.status(409).json({ 
                status: false, 
                message: "This category already exists. Please try another one." 
            });
        }
 
        const newBusinessCategory = await BusinessCategory.create({ name });
        if (!newBusinessCategory) {
            return res.status(500).json({ 
                status: false, 
                message: "Something went wrong while creating the business category.", 
                data: {} 
            });
        } 

        return res.status(201).json({ 
            status: true, 
            message: "Business category added successfully.", 
            data: newBusinessCategory 
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

const updateBusinessCategory = async (req, res) => {
    try {
        const { bus_cat_id } = req.query;
        const body = req.body;

        if (!bus_cat_id) {
            return res.status(400).json({
                status: false,
                message: "BusinessCategory ID is required."
            });
        }

        const checkBusinessCategory = await BusinessCategory.findByPk(bus_cat_id);
        if (!checkBusinessCategory) {
            return res.status(404).json({
                status: false,
                message: "This BusinessCategory does not exist. Please check the BusinessCategory ID."
            });
        }

        const [affectedRows] = await BusinessCategory.update(body, { where: { id: bus_cat_id } });

        if (affectedRows === 0) {
            return res.status(400).json({
                status: false,
                message: "No changes were made to the BusinessCategory data. Please check the provided information.",
                data: {}
            });
        }

        return res.status(200).json({
            status: true,
            message: "BusinessCategory updated successfully.",
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


const getBusinessCategoryList = async (req, res) => {
    try {
        const businessCategoryList = await BusinessCategory.findAll();
 
        if (!businessCategoryList || businessCategoryList.length === 0) {
            return res.status(404).json({ 
                status: false, 
                message: "No business categories found.", 
                data: [] 
            });
        }
 
        return res.status(200).json({ 
            status: true, 
            message: "Business category list retrieved successfully.", 
            data: businessCategoryList 
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


const getBusinessCategory = async (req, res) => {
    try {
        const { bus_cat_id } = req.query;
 
        if (!bus_cat_id) {
            return res.status(400).json({ 
                status: false, 
                message: "Business category ID is required." 
            });
        }
 
        const businessCategory = await BusinessCategory.findByPk(bus_cat_id);
        if (!businessCategory) {
            return res.status(404).json({ 
                status: false, 
                message: "Business category not found.", 
                data: {} 
            });
        }
 
        return res.status(200).json({ 
            status: true, 
            message: "Business category retrieved successfully.", 
            data: businessCategory 
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
    addBusinessCategory,
    getBusinessCategoryList,
    getBusinessCategory,
    updateBusinessCategory
}