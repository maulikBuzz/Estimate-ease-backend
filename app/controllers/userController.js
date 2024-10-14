const User = require('../models').User;
const BusinessCategory = require('../models').BusinessCategory;
const bcrypt = require('bcrypt');
const saltRounds = 10;


const addUser = async (req, res) => {
    try {
        let { merchant_id, name, email, phone_number, password } = req.body;

        const existingUser = await User.findOne({
            where: { merchant_id, name, email, phone_number }
        });

        if (existingUser) {
            return res.status(409).json({
                status: false,
                message: "This user already exists. Please try another one."
            });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        password = hashedPassword;
        const newUser = await User.create({ merchant_id, name, email, phone_number, password });
        if (!newUser) {
            return res.status(500).json({
                status: false,
                message: "Something went wrong while inserting user data.",
                data: {}
            });
        }

        return res.status(201).json({
            status: true,
            message: "User added successfully.",
            data: newUser
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


const updateUser = async (req, res) => {
    try {
        const { user_id } = req.query;
        const updateData = req.body;

        if (!user_id) {
            return res.status(400).json({
                status: false,
                message: "User ID is required."
            });
        }
        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).json({
                status: false,
                message: "This User does not exist. Please check the User ID."
            });
        }

        const [affectedRows] = await User.update(updateData, { where: { id: user_id } });

        if (affectedRows === 0) {
            return res.status(400).json({
                status: false,
                message: "No changes were made to the User data. Please check the provided information.",
                data: {}
            });
        }

        return res.status(200).json({ 
            status: true,
            message: "User updated successfully.",
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


const getUserList = async (req, res) => {
    try {
        const { merchant_id } = req.query;

        const queryCondition = merchant_id ? { where: { merchant_id } } : {};

        const users = await User.findAll(queryCondition);

        if (users.length === 0) {
            return res.status(404).json({
                status: false,
                message: "No users found for the given merchant.",
                data: []
            });
        }

        return res.status(200).json({
            status: true,
            message: "User list retrieved successfully.",
            data: users
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

const getUser = async (req, res) => {
    try {
        let { user_id } = req.query;
 
        if (user_id == null) user_id = req.id   
        if (!user_id) {
            return res.status(400).json({
                status: false,
                message: "User ID is required."
            });
        }

        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found.",
                data: {}
            });
        }

        return res.status(200).json({
            status: true,
            message: "User retrieved successfully.",
            data: user
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

const deleteUser = async (req, res) => {
    try {
        const { user_id } = req.query;

        if (!user_id) {
            return res.status(400).json({
                status: false,
                message: "User ID is required."
            });
        }

        const deletedRows = await User.destroy({ where: { id: user_id } });
        if (deletedRows === 0) {
            return res.status(404).json({
                status: false,
                message: "This User does not exist. Please check the User ID."
            });
        }

        return res.status(200).json({
            status: true,
            message: "User deleted successfully.",
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
    addUser,
    getUserList,
    getUser,
    deleteUser,
    updateUser
}