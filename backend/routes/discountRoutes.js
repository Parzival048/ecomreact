const express = require('express');
const router = express.Router();
const {
  createDiscount,
  getDiscounts,
  getActiveDiscounts,
  getDiscountById,
  updateDiscount,
  deleteDiscount,
  getFeaturedDiscount,
} = require('../controllers/discountController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes - these need to come BEFORE parameterized routes
router.route('/active').get(getActiveDiscounts);
router.route('/featured').get(getFeaturedDiscount);

// Admin routes (protected)
router.route('/')
  .post(protect, admin, createDiscount)
  .get(protect, admin, getDiscounts);

router.route('/:id')
  .get(protect, admin, getDiscountById)
  .put(protect, admin, updateDiscount)
  .delete(protect, admin, deleteDiscount);

module.exports = router;
