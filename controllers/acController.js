const AC = require('../models/AC');
const RentalInquiry = require('../models/RentalInquiry');
const { notifyRentalInquiry } = require('../utils/notifications');

// Get all ACs with filters
exports.getAllACs = async (req, res, next) => {
  try {
    const {
      search,
      brand,
      capacity,
      type,
      location,
      duration,
      minPrice,
      maxPrice
    } = req.query;

    // Build query
    let query = {};

    // Search functionality
    if (search) {
      query.$or = [
        { brand: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filters
    if (brand) {
      query.brand = { $regex: brand, $options: 'i' };
    }
    if (capacity) {
      query.capacity = capacity;
    }
    if (type) {
      query.type = type;
    }
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Price filters based on duration
    if (duration && (minPrice || maxPrice)) {
      const priceField = `price.${duration}`;
      query[priceField] = {};
      if (minPrice) {
        query[priceField].$gte = parseFloat(minPrice);
      }
      if (maxPrice) {
        query[priceField].$lte = parseFloat(maxPrice);
      }
    } else if (minPrice || maxPrice) {
      // If no duration specified, default to monthly
      query['price.monthly'] = {};
      if (minPrice) {
        query['price.monthly'].$gte = parseFloat(minPrice);
      }
      if (maxPrice) {
        query['price.monthly'].$lte = parseFloat(maxPrice);
      }
    }

    // Get ACs
    const acs = await AC.find(query).sort({ createdAt: -1 });
    const total = await AC.countDocuments(query);

    res.status(200).json({
      success: true,
      data: acs,
      total
    });
  } catch (error) {
    next(error);
  }
};

// Get AC by ID
exports.getACById = async (req, res, next) => {
  try {
    const ac = await AC.findById(req.params.id);

    if (!ac) {
      return res.status(404).json({
        success: false,
        message: 'AC not found'
      });
    }

    res.status(200).json({
      success: true,
      data: ac
    });
  } catch (error) {
    next(error);
  }
};

// Get all ACs (Admin) - includes all statuses
exports.getAllACsAdmin = async (req, res, next) => {
  try {
    const acs = await AC.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: acs
    });
  } catch (error) {
    next(error);
  }
};

// Add new AC (Admin)
exports.addAC = async (req, res, next) => {
  try {
    const {
      brand,
      model,
      capacity,
      type,
      description,
      location,
      status,
      price,
      images
    } = req.body;

    // Images come as array of URLs from frontend (already uploaded to Cloudinary)
    const imageUrls = Array.isArray(images) ? images : [];

    // Validate price object exists (validation middleware should catch this, but adding safety check)
    if (!price || !price.monthly || !price.quarterly || !price.yearly) {
      return res.status(400).json({
        success: false,
        message: 'Price object with monthly, quarterly, and yearly fields is required'
      });
    }

    const ac = await AC.create({
      brand,
      model,
      capacity,
      type,
      description,
      location,
      price: {
        monthly: parseFloat(price.monthly),
        quarterly: parseFloat(price.quarterly),
        yearly: parseFloat(price.yearly)
      },
      status: status || 'Available',
      images: imageUrls
    });

    res.status(201).json({
      success: true,
      message: 'AC added successfully',
      data: ac
    });
  } catch (error) {
    next(error);
  }
};

// Update AC (Admin)
exports.updateAC = async (req, res, next) => {
  try {
    const ac = await AC.findById(req.params.id);

    if (!ac) {
      return res.status(404).json({
        success: false,
        message: 'AC not found'
      });
    }

    // Update fields
    const updateFields = {};
    if (req.body.brand) updateFields.brand = req.body.brand;
    if (req.body.model) updateFields.model = req.body.model;
    if (req.body.capacity) updateFields.capacity = req.body.capacity;
    if (req.body.type) updateFields.type = req.body.type;
    if (req.body.description !== undefined) updateFields.description = req.body.description;
    if (req.body.location) updateFields.location = req.body.location;
    if (req.body.status) updateFields.status = req.body.status;

    // Update price if provided
    if (req.body.price) {
      updateFields.price = {
        monthly: req.body.price.monthly !== undefined ? parseFloat(req.body.price.monthly) : ac.price.monthly,
        quarterly: req.body.price.quarterly !== undefined ? parseFloat(req.body.price.quarterly) : ac.price.quarterly,
        yearly: req.body.price.yearly !== undefined ? parseFloat(req.body.price.yearly) : ac.price.yearly
      };
    }

    // Update images if provided (images come as array of URLs from frontend)
    if (req.body.images !== undefined) {
      updateFields.images = Array.isArray(req.body.images) ? req.body.images : [];
    }

    const updatedAC = await AC.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'AC updated successfully',
      data: updatedAC
    });
  } catch (error) {
    next(error);
  }
};

// Delete AC (Admin)
exports.deleteAC = async (req, res, next) => {
  try {
    const ac = await AC.findById(req.params.id);

    if (!ac) {
      return res.status(404).json({
        success: false,
        message: 'AC not found'
      });
    }

    await AC.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'AC deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Create rental inquiry (called from routes)
exports.createRentalInquiry = async (req, res, next) => {
  try {
    const { name, email, phone, message, acId, acDetails } = req.body;
    const { id } = req.params;

    // Use acId from request body if provided, otherwise use id from URL params
    const finalAcId = acId || id;

    // Check if AC exists
    const ac = await AC.findById(finalAcId);
    if (!ac) {
      return res.status(404).json({
        success: false,
        message: 'AC not found'
      });
    }

    // Use acDetails from request body if provided, otherwise construct from AC
    let finalAcDetails = acDetails;
    if (!finalAcDetails) {
      finalAcDetails = {
        id: ac._id.toString(),
        brand: ac.brand,
        model: ac.model,
        capacity: ac.capacity,
        type: ac.type,
        location: ac.location,
        price: {
          monthly: ac.price.monthly,
          quarterly: ac.price.quarterly,
          yearly: ac.price.yearly
        }
      };
    }

    // Create inquiry with AC details
    const inquiry = await RentalInquiry.create({
      acId: finalAcId,
      acDetails: finalAcDetails,
      name,
      email,
      phone,
      message
    });

    // Notify admin
    await notifyRentalInquiry(inquiry);

    res.status(201).json({
      success: true,
      message: 'Rental inquiry submitted successfully',
      data: inquiry
    });
  } catch (error) {
    next(error);
  }
};

