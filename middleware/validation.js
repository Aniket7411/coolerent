const { body, validationResult } = require('express-validator');

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg
    });
  }
  next();
};

// Validate rental inquiry
exports.validateRentalInquiry = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone is required')
    .matches(/^\+91\s?\d{10}$/)
    .withMessage('Please provide a valid Indian phone number (+91 XXXXXXXXXX)'),
  body('message')
    .optional()
    .trim(),
  handleValidationErrors
];

// Validate service request
exports.validateServiceRequest = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required'),
  body('acType')
    .trim()
    .notEmpty()
    .withMessage('AC type is required')
    .isIn(['Split', 'Window', 'Central'])
    .withMessage('AC type must be Split, Window, or Central'),
  body('brand')
    .trim()
    .notEmpty()
    .withMessage('Brand is required'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required'),
  body('address')
    .trim()
    .notEmpty()
    .withMessage('Address is required'),
  body('contactNumber')
    .trim()
    .notEmpty()
    .withMessage('Contact number is required')
    .matches(/^\+91\s?\d{10}$/)
    .withMessage('Please provide a valid Indian phone number (+91 XXXXXXXXXX)'),
  body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array'),
  body('images.*')
    .optional()
    .isURL()
    .withMessage('Each image must be a valid URL'),
  handleValidationErrors
];

// Validate lead
exports.validateLead = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required'),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone is required')
    .matches(/^\+91\s?\d{10}$/)
    .withMessage('Please provide a valid Indian phone number (+91 XXXXXXXXXX)'),
  body('interest')
    .trim()
    .notEmpty()
    .withMessage('Interest is required')
    .isIn(['rental', 'service'])
    .withMessage('Interest must be rental or service'),
  body('source')
    .trim()
    .notEmpty()
    .withMessage('Source is required')
    .isIn(['browse', 'contact'])
    .withMessage('Source must be browse or contact'),
  handleValidationErrors
];

// Validate contact form
exports.validateContact = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone is required')
    .matches(/^\+91\s?\d{10}$/)
    .withMessage('Please provide a valid Indian phone number (+91 XXXXXXXXXX)'),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required'),
  handleValidationErrors
];

// Validate vendor listing request
exports.validateVendorListing = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone is required')
    .matches(/^\+91\s?\d{10}$/)
    .withMessage('Please provide a valid Indian phone number (+91 XXXXXXXXXX)'),
  body('message')
    .optional()
    .trim(),
  handleValidationErrors
];

// Validate admin login
exports.validateAdminLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Validate AC creation/update
// For JSON requests, price comes as nested object: { price: { monthly, quarterly, yearly } }
exports.validateAC = [
  body('brand')
    .trim()
    .notEmpty()
    .withMessage('Brand is required'),
  body('model')
    .trim()
    .notEmpty()
    .withMessage('Model is required'),
  body('capacity')
    .trim()
    .notEmpty()
    .withMessage('Capacity is required')
    .isIn(['1 Ton', '1.5 Ton', '2 Ton', '2.5 Ton'])
    .withMessage('Capacity must be 1 Ton, 1.5 Ton, 2 Ton, or 2.5 Ton'),
  body('type')
    .trim()
    .notEmpty()
    .withMessage('Type is required')
    .isIn(['Split', 'Window'])
    .withMessage('Type must be Split or Window'),
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required'),
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isObject()
    .withMessage('Price must be an object'),
  body('price.monthly')
    .notEmpty()
    .withMessage('Monthly price is required')
    .isFloat({ min: 0 })
    .withMessage('Monthly price must be a positive number'),
  body('price.quarterly')
    .notEmpty()
    .withMessage('Quarterly price is required')
    .isFloat({ min: 0 })
    .withMessage('Quarterly price must be a positive number'),
  body('price.yearly')
    .notEmpty()
    .withMessage('Yearly price is required')
    .isFloat({ min: 0 })
    .withMessage('Yearly price must be a positive number'),
  body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array'),
  body('images.*')
    .optional()
    .isURL()
    .withMessage('Each image must be a valid URL'),
  body('status')
    .optional()
    .isIn(['Available', 'Rented Out', 'Under Maintenance'])
    .withMessage('Status must be Available, Rented Out, or Under Maintenance'),
  handleValidationErrors
];

