const express = require('express');
const router = express.Router();
const { login } = require('../controllers/adminController');
const {
  getAllACsAdmin,
  addAC,
  updateAC,
  deleteAC
} = require('../controllers/acController');
const {
  getAllRentalInquiries,
  updateInquiryStatus
} = require('../controllers/rentalInquiryController');
const {
  getAllVendorRequests
} = require('../controllers/vendorController');
const {
  createService,
  updateService,
  deleteService
} = require('../controllers/serviceController');
const {
  getAllServiceBookings,
  updateServiceBookingStatus
} = require('../controllers/serviceBookingController');
const auth = require('../middleware/auth');
const { validateAdminLogin, validateAC, validateService } = require('../middleware/validation');

// Admin login (public)
router.post('/login', validateAdminLogin, login);

// Admin AC routes
router.get('/acs', auth, getAllACsAdmin);
router.post('/acs', auth, validateAC, addAC);
router.patch('/acs/:id', auth, updateAC);
router.delete('/acs/:id', auth, deleteAC);

// Admin rental inquiries routes
router.get('/rental-inquiries', auth, getAllRentalInquiries);
router.patch('/rental-inquiries/:id', auth, updateInquiryStatus);

// Admin vendor requests routes
router.get('/vendor-requests', auth, getAllVendorRequests);

// Admin service management routes
router.post('/services', auth, validateService, createService);
router.patch('/services/:id', auth, updateService);
router.delete('/services/:id', auth, deleteService);

// Admin service bookings routes
router.get('/service-bookings', auth, getAllServiceBookings);
router.patch('/service-bookings/:id', auth, updateServiceBookingStatus);

module.exports = router;

