const Contact = require('../models/Contact');
const { notifyAdmin } = require('../utils/notifications');

// Submit contact form
exports.submitContact = async (req, res, next) => {
  try {
    const { name, email, phone, message } = req.body;

    await Contact.create({
      name,
      email,
      phone,
      message
    });

    // Notify admin
    const subject = 'New Contact Form Submission';
    const messageText = `
      A new contact form has been submitted:
      
      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      Message: ${message}
    `;

    await notifyAdmin(subject, messageText);

    res.status(200).json({
      success: true,
      message: 'Message sent successfully'
    });
  } catch (error) {
    next(error);
  }
};

