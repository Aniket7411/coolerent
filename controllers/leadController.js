const Lead = require('../models/Lead');
const { notifyLead } = require('../utils/notifications');

// Create lead
exports.createLead = async (req, res, next) => {
  try {
    const { name, phone, message } = req.body;

    const lead = await Lead.create({
      name,
      phone,
      message
    });

    // Notify admin
    await notifyLead(lead);

    res.status(201).json({
      success: true,
      message: 'Lead submitted successfully',
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

