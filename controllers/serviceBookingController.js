const ServiceBooking = require('../models/ServiceBooking');
const Service = require('../models/Service');
const { notifyAdmin } = require('../utils/notifications');

// Create service booking (Public)
exports.createServiceBooking = async (req, res, next) => {
  try {
    const { serviceId, name, phone } = req.body;
    // Backward compatibility: accept old keys `date` and `time`
    const preferredDate = req.body.preferredDate || req.body.date;
    let preferredTime = req.body.preferredTime || req.body.time;
    const address = req.body.address;
    const notes = req.body.notes;

    // Normalize AM/PM time to 24-hour HH:mm if needed
    if (/^(0?[1-9]|1[0-2]):[0-5]\d\s?(AM|PM)$/i.test(preferredTime)) {
      const match = preferredTime.match(/^(0?[1-9]|1[0-2]):([0-5]\d)\s?(AM|PM)$/i);
      if (match) {
        let hour = parseInt(match[1], 10);
        const minute = match[2];
        const ampm = match[3].toUpperCase();
        if (ampm === 'PM' && hour !== 12) hour += 12;
        if (ampm === 'AM' && hour === 12) hour = 0;
        preferredTime = `${hour.toString().padStart(2, '0')}:${minute}`;
      }
    }

    // Check if service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Validate date is in the future
    const bookingDate = new Date(preferredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (bookingDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Booking date must be in the future'
      });
    }

    // Create booking
    const booking = await ServiceBooking.create({
      serviceId,
      name,
      phone,
      preferredDate,
      preferredTime,
      address,
      notes
    });

    // Notify admin
    const subject = 'New Service Booking';
    const messageText = `
      A new service booking has been created:
      
      Service: ${service.title}
      Customer: ${name}
      Phone: ${phone}
      Date: ${preferredDate}
      Time: ${preferredTime}
      Address: ${address}
      Notes: ${notes || 'N/A'}
    `;

    await notifyAdmin(subject, messageText);

    res.status(201).json({
      success: true,
      message: 'Service booking submitted successfully',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// Get all service bookings (Admin)
exports.getAllServiceBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    // Build query
    let query = {};
    if (status) {
      query.status = status;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get bookings with pagination
    const bookings = await ServiceBooking.find(query)
      .populate('serviceId', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await ServiceBooking.countDocuments(query);

    res.status(200).json({
      success: true,
      data: bookings,
      total,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    next(error);
  }
};

// Update service booking status (Admin)
exports.updateServiceBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ['New', 'Contacted', 'In-Progress', 'Resolved', 'Rejected'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: New, Contacted, In-Progress, Resolved, Rejected'
      });
    }

    const booking = await ServiceBooking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Service booking not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lead status updated',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

