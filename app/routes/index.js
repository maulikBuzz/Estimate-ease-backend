const express = require('express');
const router = express.Router();

const adminAuthRoutes = require('./adminAuthRoutes');
const userAuthRoutes = require('./userAuthRoutes');

router.use('/admin', adminAuthRoutes);
router.use('/api/v1', userAuthRoutes);

module.exports = router;
