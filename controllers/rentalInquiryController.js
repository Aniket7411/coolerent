const RentalInquiry = require('../models/RentalInquiry');
const AC = require('../models/AC');
const { notifyRentalInquiry } = require('../utils/notifications');

// Create rental inquiry
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

// Get all rental inquiries (Admin)
exports.getAllRentalInquiries = async (req, res, next) => {
  try {
    const inquiries = await RentalInquiry.find()
      .sort({ createdAt: -1 });

    // Format response - use stored acDetails if available
    const formattedInquiries = inquiries.map(inquiry => ({
      _id: inquiry._id,
      acId: inquiry.acId,
      acDetails: inquiry.acDetails || {
        id: inquiry.acId?.toString() || '',
        brand: '',
        model: '',
        capacity: '',
        type: '',
        location: '',
        price: {
          monthly: 0,
          quarterly: 0,
          yearly: 0
        }
      },
      name: inquiry.name,
      email: inquiry.email,
      phone: inquiry.phone,
      message: inquiry.message,
      status: inquiry.status,
      createdAt: inquiry.createdAt
    }));

    res.status(200).json({
      success: true,
      data: formattedInquiries
    });
  } catch (error) {
    next(error);
  }
};

// Update inquiry status (Admin)
exports.updateInquiryStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ['Pending', 'Contacted', 'Completed', 'Cancelled'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: Pending, Contacted, Completed, Cancelled'
      });
    }

    const inquiry = await RentalInquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Inquiry status updated',
      data: {
        _id: inquiry._id,
        status: inquiry.status,
        updatedAt: inquiry.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
};

