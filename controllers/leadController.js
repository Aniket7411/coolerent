const Lead = require('../models/Lead');
const { notifyLead } = require('../utils/notifications');

// Create lead
exports.createLead = async (req, res, next) => {
  try {
    const { name, phone, interest, source } = req.body;

    const lead = await Lead.create({
      name,
      phone,
      interest,
      source
    });

    // Notify admin
    await notifyLead(lead);

    res.status(201).json({
      success: true,
      message: 'Thank you! We will contact you soon.',
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

