const express = require('express');
const { getOwnerDashboard } = require('../controllers/ownerController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken, authorizeRoles('STORE_OWNER'));

router.get('/dashboard', getOwnerDashboard);

module.exports = router;
