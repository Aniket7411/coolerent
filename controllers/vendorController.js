const VendorListing = require('../models/VendorListing');
const { notifyAdmin } = require('../utils/notifications');

// Submit vendor listing request
exports.submitVendorListing = async (req, res, next) => {
  try {
    const { name, email, phone, message } = req.body;

    await VendorListing.create({
      name,
      email,
      phone,
      message
    });

    // Notify admin
    const subject = 'New Vendor Listing Request';
    const messageText = `
      A new vendor listing request has been submitted:
      
      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      Message: ${message || 'N/A'}
    `;

    await notifyAdmin(subject, messageText);

    res.status(200).json({
      success: true,
      message: 'Request submitted successfully. We will contact you soon.'
    });
  } catch (error) {
    next(error);
  }
};

// Get all vendor requests (Admin)
exports.getAllVendorRequests = async (req, res, next) => {
  try {
    const requests = await VendorListing.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: requests
    });
  } catch (error) {
    next(error);
  }
};

