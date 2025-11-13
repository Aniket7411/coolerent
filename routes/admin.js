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
  getAllServiceRequests,
  updateServiceRequestStatus
} = require('../controllers/serviceRequestController');
const {
  getAllRentalInquiries,
  updateInquiryStatus
} = require('../controllers/rentalInquiryController');
const {
  getAllVendorRequests
} = require('../controllers/vendorController');
const auth = require('../middleware/auth');
const { validateAdminLogin, validateAC } = require('../middleware/validation');

// Admin login (public)
router.post('/login', validateAdminLogin, login);

// Admin AC routes
router.get('/acs', auth, getAllACsAdmin);
router.post('/acs', auth, validateAC, addAC);
router.patch('/acs/:id', auth, updateAC);
router.delete('/acs/:id', auth, deleteAC);

// Admin service leads routes
router.get('/service-leads', auth, getAllServiceRequests);
router.patch('/service-leads/:id', auth, updateServiceRequestStatus);

// Admin rental inquiries routes
router.get('/rental-inquiries', auth, getAllRentalInquiries);
router.patch('/rental-inquiries/:id', auth, updateInquiryStatus);

// Admin vendor requests routes
router.get('/vendor-requests', auth, getAllVendorRequests);

module.exports = router;

