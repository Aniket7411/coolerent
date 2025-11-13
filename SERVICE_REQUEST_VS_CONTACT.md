# Service Request vs Contact Form - Important Distinction

## ⚠️ CRITICAL: These are TWO DIFFERENT endpoints and schemas!

### 1. Service Request (AC Repair/Maintenance)
**Endpoint:** `POST /service-requests`

**Purpose:** Users requesting AC repair or maintenance service

**Data Structure:**
```json
{
  "name": "John Doe",
  "acType": "Split",
  "brand": "LG",
  "model": "LG 1.5 Ton",
  "description": "AC not cooling properly",
  "address": "123 Main St, Mumbai",
  "contactNumber": "+91 9876543210",
  "images": ["https://cloudinary.com/image1.jpg", "https://cloudinary.com/image2.jpg"],
  "status": "New"
}
```

**Backend Requirements:**
- Store in **separate collection/schema** (e.g., `ServiceRequest` or `ServiceLeads`)
- Should have fields: `name`, `acType`, `brand`, `model`, `description`, `address`, `contactNumber`, `images`, `status`, `createdAt`
- Status values: `"New"`, `"Contacted"`, `"Job Completed"`
- Admin can view these at `/admin/service-leads` endpoint

---

### 2. Contact Form (General Inquiry)
**Endpoint:** `POST /contact`

**Purpose:** General inquiries, questions, feedback

**Data Structure:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+91 9876543210",
  "message": "I have a question about your services"
}
```

**Backend Requirements:**
- Store in **separate collection/schema** (e.g., `Contact` or `ContactInquiry`)
- Should have fields: `name`, `email`, `phone`, `message`, `createdAt`
- This is NOT for service requests

---

### 3. Vendor Listing Request
**Endpoint:** `POST /vendor-listing-request`

**Purpose:** Vendors wanting to list their ACs on the platform

**Data Structure:**
```json
{
  "name": "Vendor Name",
  "email": "vendor@example.com",
  "phone": "+91 9876543210",
  "message": "I want to list my ACs"
}
```

**Backend Requirements:**
- Store in **separate collection/schema** (e.g., `VendorRequest`)
- Admin can view these at `/admin/vendor-requests` endpoint

---

## Summary

| Type | Endpoint | Collection/Schema | Purpose |
|------|----------|-------------------|---------|
| Service Request | `POST /service-requests` | `ServiceRequest` | AC repair/maintenance |
| Contact Form | `POST /contact` | `Contact` | General inquiries |
| Vendor Request | `POST /vendor-listing-request` | `VendorRequest` | Vendor listing requests |

## ⚠️ IMPORTANT FOR BACKEND:

1. **DO NOT** store service requests in the contact form collection
2. **DO NOT** store contact forms in the service request collection
3. These are **three separate schemas/collections**
4. Service requests should be accessible via `GET /admin/service-leads`
5. Contact forms are general inquiries (may not need admin endpoint)
6. Vendor requests should be accessible via `GET /admin/vendor-requests`

## Frontend Usage:

- **Service Request Form** (`/user/service-request`) → Calls `POST /service-requests`
- **Contact Form** (`/contact`) → Calls `POST /contact` (for general inquiries)
- **Contact Form** (`/contact` with vendor option) → Calls `POST /vendor-listing-request`

