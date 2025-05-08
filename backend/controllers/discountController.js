const Discount = require('../models/discountModel');
const Product = require('../models/productModel');

// @desc    Create a new discount
// @route   POST /api/discounts
// @access  Private/Admin
const createDiscount = async (req, res) => {
  try {
    const {
      name,
      description,
      discountPercentage,
      startDate,
      endDate,
      isActive,
      featuredImage,
      applicableProducts,
      applyToAllProducts,
    } = req.body;

    const discount = new Discount({
      name,
      description,
      discountPercentage,
      startDate,
      endDate,
      isActive,
      featuredImage,
      applicableProducts: applicableProducts || [],
      applyToAllProducts: applyToAllProducts || false,
      createdBy: req.user._id,
    });

    const createdDiscount = await discount.save();
    res.status(201).json(createdDiscount);
  } catch (error) {
    res.status(400);
    throw new Error('Invalid discount data: ' + error.message);
  }
};

// @desc    Get all discounts
// @route   GET /api/discounts
// @access  Private/Admin
const getDiscounts = async (req, res) => {
  try {
    const discounts = await Discount.find({}).sort({ createdAt: -1 });
    res.json(discounts);
  } catch (error) {
    res.status(500);
    throw new Error('Error fetching discounts: ' + error.message);
  }
};

// @desc    Get active discounts
// @route   GET /api/discounts/active
// @access  Public
const getActiveDiscounts = async (req, res) => {
  try {
    const now = new Date();
    const discounts = await Discount.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    }).sort({ discountPercentage: -1 });
    
    res.json(discounts);
  } catch (error) {
    res.status(500);
    throw new Error('Error fetching active discounts: ' + error.message);
  }
};

// @desc    Get discount by ID
// @route   GET /api/discounts/:id
// @access  Private/Admin
const getDiscountById = async (req, res) => {
  try {
    const discount = await Discount.findById(req.params.id);
    
    if (discount) {
      res.json(discount);
    } else {
      res.status(404);
      throw new Error('Discount not found');
    }
  } catch (error) {
    res.status(500);
    throw new Error('Error fetching discount: ' + error.message);
  }
};

// @desc    Update a discount
// @route   PUT /api/discounts/:id
// @access  Private/Admin
const updateDiscount = async (req, res) => {
  try {
    const {
      name,
      description,
      discountPercentage,
      startDate,
      endDate,
      isActive,
      featuredImage,
      applicableProducts,
      applyToAllProducts,
    } = req.body;

    const discount = await Discount.findById(req.params.id);

    if (discount) {
      discount.name = name || discount.name;
      discount.description = description || discount.description;
      discount.discountPercentage = discountPercentage || discount.discountPercentage;
      discount.startDate = startDate || discount.startDate;
      discount.endDate = endDate || discount.endDate;
      discount.isActive = isActive !== undefined ? isActive : discount.isActive;
      discount.featuredImage = featuredImage || discount.featuredImage;
      discount.applicableProducts = applicableProducts || discount.applicableProducts;
      discount.applyToAllProducts = applyToAllProducts !== undefined ? applyToAllProducts : discount.applyToAllProducts;

      const updatedDiscount = await discount.save();
      res.json(updatedDiscount);
    } else {
      res.status(404);
      throw new Error('Discount not found');
    }
  } catch (error) {
    res.status(400);
    throw new Error('Error updating discount: ' + error.message);
  }
};

// @desc    Delete a discount
// @route   DELETE /api/discounts/:id
// @access  Private/Admin
const deleteDiscount = async (req, res) => {
  try {
    const discount = await Discount.findById(req.params.id);

    if (discount) {
      await Discount.deleteOne({ _id: discount._id });
      res.json({ message: 'Discount removed' });
    } else {
      res.status(404);
      throw new Error('Discount not found');
    }
  } catch (error) {
    res.status(500);
    throw new Error('Error deleting discount: ' + error.message);
  }
};

// @desc    Get featured discount for homepage
// @route   GET /api/discounts/featured
// @access  Public
const getFeaturedDiscount = async (req, res) => {
  try {
    const now = new Date();
    const featuredDiscount = await Discount.findOne({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    }).sort({ discountPercentage: -1 });
    
    res.json(featuredDiscount);
  } catch (error) {
    res.status(500);
    throw new Error('Error fetching featured discount: ' + error.message);
  }
};

module.exports = {
  createDiscount,
  getDiscounts,
  getActiveDiscounts,
  getDiscountById,
  updateDiscount,
  deleteDiscount,
  getFeaturedDiscount,
};
