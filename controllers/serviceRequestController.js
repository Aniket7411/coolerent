const ServiceRequest = require('../models/ServiceRequest');
const { notifyServiceRequest } = require('../utils/notifications');

// Create service request
exports.createServiceRequest = async (req, res, next) => {
  try {
    const {
      name,
      acType,
      brand,
      model,
      description,
      address,
      contactNumber,
      images
    } = req.body;

    // Images come as array of URLs from frontend (already uploaded to Cloudinary)
    const imageUrls = Array.isArray(images) ? images : [];

    const serviceRequest = await ServiceRequest.create({
      name,
      acType,
      brand,
      model,
      description,
      address,
      contactNumber,
      images: imageUrls
    });

    // Notify admin
    await notifyServiceRequest(serviceRequest);

    res.status(201).json({
      success: true,
      message: 'Service request submitted successfully',
      data: serviceRequest
    });
  } catch (error) {
    next(error);
  }
};

// Get all service requests (Admin)
exports.getAllServiceRequests = async (req, res, next) => {
  try {
    const serviceRequests = await ServiceRequest.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: serviceRequests
    });
  } catch (error) {
    next(error);
  }
};

// Update service request status (Admin)
exports.updateServiceRequestStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ['New', 'Contacted', 'Job Completed'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: New, Contacted, Job Completed'
      });
    }

    const serviceRequest = await ServiceRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!serviceRequest) {
      return res.status(404).json({
        success: false,
        message: 'Service request not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lead status updated',
      data: {
        _id: serviceRequest._id,
        status: serviceRequest.status,
        updatedAt: serviceRequest.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
};

