const Unit = require('../models').Unit;


const addUnit = async (req, res) => {
    try {
        const { name, code } = req.body;

        const existingUnit = await Unit.findOne({ where: { name, code } });
        if (existingUnit) {
            return res.status(409).json({
                status: false,
                message: "This Unit already exists. Please try another one.",
                data: {}
            });
        }

        const newUnit = await Unit.create({ name, code });
        if (!newUnit) {
            return res.status(400).json({
                status: false,
                message: "Something went wrong while inserting Unit data.",
                data: {}
            });
        }

        return res.status(201).json({
            status: true,
            message: "Unit added successfully.",
            data: newUnit
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


const updateUnit = async (req, res) => {
    try {
        const { unit_id } = req.query;
        const { name, code } = req.body;
        const body = { name, code }

        const existingUnit = await Unit.findByPk(unit_id);
        if (!existingUnit) {
            return res.status(404).json({
                status: false,
                message: "This Unit does not exist. Please check Unit ID.",
                data: {}
            });
        }

        const [affectedRows] = await Unit.update(body, { where: { id: unit_id } });
        if (affectedRows === 0) {
            return res.status(400).json({
                status: false,
                message: "No changes were made to the Unit data. Please check the provided information.",
                data: {}
            });
        }

        return res.status(200).json({
            status: true,
            message: "Unit updated successfully.",
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


const getUnitList = async (req, res) => {
    try {
        const units = await Unit.findAll();

        if (units.length === 0) {
            return res.status(404).json({
                status: false,
                message: "No units found.",
                data: []
            });
        }

        return res.status(200).json({
            status: true,
            message: "Unit list retrieved successfully.",
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

const getUnit = async (req, res) => {
    try {
        const { unit_id } = req.query;

        const unit = await Unit.findByPk(unit_id);

        if (!unit) {
            return res.status(404).json({
                status: false,
                message: "Unit not found.",
                data: {}
            });
        }

        return res.status(200).json({
            status: true,
            message: "Unit retrieved successfully.",
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

const deleteUnit = async (req, res) => {
    try {
        const { unit_id } = req.query;

        const deletedRows = await Unit.destroy({ where: { id: unit_id } });

        if (deletedRows === 0) {
            return res.status(404).json({
                status: false,
                message: "This Unit does not exist. Please check the Unit ID.",
                data: {}
            });
        }

        return res.status(200).json({
            status: true,
            message: "Unit deleted successfully.",
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
    addUnit,
    getUnitList,
    getUnit,
    deleteUnit,
    updateUnit
}