const express = require('express');
const {
  getDashboardStats,
  addUser,
  addStore,
  getUsers,
  getUserDetails,
  getStores
} = require('../controllers/adminController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Admin protection for all routes in this file
router.use(authenticateToken, authorizeRoles('SYSTEM_ADMIN'));

router.get('/dashboard-stats', getDashboardStats);
router.post('/users', addUser);
router.post('/stores', addStore);
router.get('/users', getUsers);
router.get('/users/:id', getUserDetails);
router.get('/stores', getStores);

module.exports = router;
