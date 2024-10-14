const SubProductUnit = require('../models').SubProductUnit;
const Unit = require('../models').Unit;


const addSubProductUnit = async (req, res) => {
    try {
        const { unit_id, sub_product_id } = req.body;
 
        const existingSubProductUnit = await SubProductUnit.findOne({ where: { unit_id, sub_product_id } });
        if (existingSubProductUnit) {
            return res.status(409).json({
                status: false,
                message: "This SubProductUnit already exists. Please try another one.",
                data: {}
            });
        }
 
        const newSubProductUnit = await SubProductUnit.create({ unit_id, sub_product_id });
        if (!newSubProductUnit) {
            return res.status(400).json({
                status: false,
                message: "Something went wrong while inserting Sub Product Unit data.",
                data: {}
            });
        }
 
        return res.status(201).json({
            status: true,
            message: "Sub Product Unit added successfully.",
            data: newSubProductUnit
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

const getSubProductUnitList = async (req, res) => {
    try {

        const { sub_product_id } = req.query;
       
        const queryCondition = sub_product_id ? { where: { sub_product_id } } : {};
        const units = await SubProductUnit.findAll({
            ...queryCondition, include: [{
                model: Unit,
                as: 'units',
            }]
        });

        if (units.length === 0) {
            return res.status(404).json({
                status: false,
                message: "No units found.",
                data: []
            });
        }

        return res.status(200).json({
            status: true,
            message: "Sub Product Unit list retrieved successfully.",
            data: units
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

const getSubProductUnit = async (req, res) => {
    try {
        const { unit_id } = req.query;

        const unit = await SubProductUnit.findByPk(unit_id);

        if (!unit) {
            return res.status(404).json({
                status: false,
                message: "Sub Product Unit not found.",
                data: {}
            });
        }

        return res.status(200).json({
            status: true,
            message: "Sub Product Unit retrieved successfully.",
            data: unit
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

const deleteSubProductUnit = async (req, res) => {
    try {
        const { unit_id } = req.query;

        const deletedRows = await SubProductUnit.destroy({ where: { id: unit_id } });

        if (deletedRows === 0) {
            return res.status(404).json({
                status: false,
                message: "This Sub Product Unit does not exist. Please check the Sub Product Unit ID.",
                data: {}
            });
        }

        return res.status(200).json({
            status: true,
            message: "Sub Product Unit deleted successfully.",
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
    addSubProductUnit,
    getSubProductUnitList,
    getSubProductUnit,
    deleteSubProductUnit,
}
