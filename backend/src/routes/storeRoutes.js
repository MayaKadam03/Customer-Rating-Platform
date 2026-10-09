const express = require('express');
const { getStoresForUser, submitOrUpdateRating } = require('../controllers/storeController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Get stores (accessible by authenticated users, normal user & admin)
router.get('/', authenticateToken, getStoresForUser);

// Submit or modify rating for a store (accessible by NORMAL_USER)
router.post('/:storeId/rating', authenticateToken, authorizeRoles('NORMAL_USER'), submitOrUpdateRating);

module.exports = router;
