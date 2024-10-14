const User = require('../models').User;
const Merchant = require('../models').Merchant;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const saltRounds = 10;

const signup = async (req, res) => {
  try {
    const body = req.body;
 
    const checkMerchant = await Merchant.findByPk(body.merchant_id);
    if (!checkMerchant) {
      return res.status(404).json({
        status: false,
        message: "This Merchant does not exist. Please check the Merchant ID.",
      });
    }
 
    const hashedPassword = await bcrypt.hash(body.password, saltRounds);
    body.password = hashedPassword;
 
    const user = await User.create(body);
    return res.status(201).json({
      status: true,
      message: "User created successfully.",
      data: user,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Something went wrong. Please try again.",
      error: error.message, 
    });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;
 
    const user = await User.findOne({ where: { email } });
 
    if (!user) {
      return res.status(401).json({ status: false, message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ status: false, message: 'Invalid credentials' });
    }
 
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      status: true,
      message: "User logged in successfully.",
      data: { token },
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Something went wrong. Please try again.",
      error: error.message,
    });
  }
};




module.exports = {
  signup,
  login,
};
