const express = require('express');
const router = express.Router();
const { createServiceRequest } = require('../controllers/serviceRequestController');
const { validateServiceRequest } = require('../middleware/validation');

// Public route
router.post('/', validateServiceRequest, createServiceRequest);

module.exports = router;

