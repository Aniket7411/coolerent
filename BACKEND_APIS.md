# Backend Handoff - API Endpoints and Data Contracts

This frontend sends JSON only. Images are uploaded to Cloudinary on the frontend; the backend receives image URLs (strings). Phone numbers are sent with +91 prefix.

Response format (use consistently):
```json
{ "success": true, "message": "optional", "data": {} }
```

Base URL (configurable): `REACT_APP_API_URL` (defaults to `http://localhost:5000/api`)

------------------------------------------------------------
ADMIN AUTH
------------------------------------------------------------
POST `/admin/login`
Request:
```json
{ "email": "admin@example.com", "password": "secret" }
```
Response:
```json
{ "success": true, "token": "JWT", "user": { "id": "…", "role": "admin" } }
```
All `/admin/*` endpoints below require `Authorization: Bearer <token>`.

------------------------------------------------------------
AC CATALOG (Public)
------------------------------------------------------------
GET `/acs`
- Optional query params: `brand`, `type`, `capacity`, `page`, `limit`
Response:
```json
{ "success": true, "data": [AC], "total": 42 }
```

GET `/acs/:id`
Response:
```json
{ "success": true, "data": AC }
```

AC model (fields used by FE):
```json
{
  "_id": "…",
  "brand": "LG",
  "model": "1.5 Ton 5 Star",
  "capacity": "1.5 Ton",
  "type": "Split",
  "description": "string",
  "location": "string",
  "status": "Available|Rented|Inactive",
  "price": 1699,
  "images": ["https://res.cloudinary.com/…/img.jpg"],
  "createdAt": "date",
  "updatedAt": "date"
}
```

------------------------------------------------------------
AC MANAGEMENT (Admin)
------------------------------------------------------------
GET `/admin/acs`
Response:
```json
{ "success": true, "data": [AC] }
```

POST `/admin/acs` (JSON; images are Cloudinary URLs)
```json
{
  "brand": "LG",
  "model": "1.5 Ton 5 Star",
  "capacity": "1.5 Ton",
  "type": "Split",
  "description": "…",
  "location": "Mumbai",
  "status": "Available",
  "price": 1699,
  "images": ["https://…/image1.jpg", "https://…/image2.jpg"]
}
```
Response:
```json
{ "success": true, "message": "AC added successfully", "data": AC }
```

PATCH `/admin/acs/:id`
- Partial update; omit `images` to preserve existing images.
- If `images` is present, it must be an array of URL strings.
Example request:
```json
{ "status": "Rented", "price": 1799 }
```
Response:
```json
{ "success": true, "message": "AC updated successfully", "data": AC }
```

DELETE `/admin/acs/:id`
Response:
```json
{ "success": true, "message": "AC deleted successfully" }
```

------------------------------------------------------------
RENTAL INQUIRIES (Public + Admin)
------------------------------------------------------------
POST `/acs/:id/inquiry`
Request:
```json
{
  "acId": "<same as path param>",
  "name": "Rohit",
  "email": "r@example.com",
  "phone": "+919876543210",
  "message": "Need this AC",
  "acDetails": { "brand": "LG", "model": "1.5 Ton", "price": 1699 }
}
```
Response:
```json
{ "success": true, "message": "Rental inquiry submitted successfully", "data": { "_id": "…", "status": "New" } }
```

GET `/admin/rental-inquiries`
Response: `{ "success": true, "data": [Inquiry], "total": 10 }`

PATCH `/admin/rental-inquiries/:id`
Request: `{ "status": "Contacted|Closed|Converted" }`

------------------------------------------------------------
SERVICES (Public)  — arrays required
------------------------------------------------------------
GET `/services`
Response: `{ "success": true, "data": [Service] }`

GET `/services/:id`
Response: `{ "success": true, "data": Service }`

Service model (arrays required by FE):
```json
{
  "_id": "…",
  "title": "AC Repair",
  "description": "Short summary shown in list",
  "price": 149,
  "originalPrice": 349,
  "badge": "Visit Within 1 Hour|Most Booked|Power Saver|null",
  "image": "https://…/service.jpg",
  "process": ["Step 1 …", "Step 2 …", "Step 3 …"],
  "benefits": ["Accurate diagnostics", "Restores performance", "Prevents breakdowns"],
  "keyFeatures": ["Certified professionals", "Advanced tools", "All AC types", "Transparent guidance"],
  "recommendedFrequency": "Immediate inspection if efficiency drops/noise/leaks",
  "createdAt": "date",
  "updatedAt": "date"
}
```

------------------------------------------------------------
SERVICE MANAGEMENT (Admin)
------------------------------------------------------------
POST `/admin/services`
Request (arrays required):
```json
{
  "title": "AC Repair",
  "description": "…",
  "price": 149,
  "originalPrice": 349,
  "badge": "Visit Within 1 Hour",
  "image": "https://…/service.jpg",
  "process": ["Comprehensive examination", "Diagnosis of issues", "Leak detection", "Plan & estimate"],
  "benefits": ["Accurate diagnostics", "Restores performance", "Prevents breakdowns"],
  "keyFeatures": ["Certified professionals", "Advanced tools", "All AC types", "Transparent guidance"],
  "recommendedFrequency": "Immediate inspection if efficiency drops/noise/leaks"
}
```
Response: `{ "success": true, "message": "Service added successfully", "data": Service }`

PATCH `/admin/services/:id`
- Partial update; same schema (if arrays provided, validate as `string[]`).
Response same as POST.

DELETE `/admin/services/:id`
Response: `{ "success": true, "message": "Service deleted successfully" }`

Validation notes (Services):
- `title`, `description`, `price` required
- `process`, `benefits`, `keyFeatures` must be arrays of strings (may be empty arrays)
- `image` must be a valid URL (Cloudinary)

------------------------------------------------------------
SERVICE BOOKINGS (Public + Admin)
------------------------------------------------------------
POST `/service-bookings`
Request:
```json
{
  "serviceId": "…",
  "serviceTitle": "AC Repair",
  "servicePrice": 149,
  "date": "2025-12-31",
  "time": "10:00 AM",
  "address": "123 Main Street, City, State, PIN",
  "addressType": "myself|someoneElse",
  "contactName": "John Doe",
  "contactPhone": "+919876543210",
  "paymentOption": "payNow|payLater"
}
```
Rules:
- `contactName` and `contactPhone` required only if `addressType` is `"someoneElse"`.
- `contactPhone` format: `+91` + 10 digits.

Response:
```json
{ "success": true, "message": "Service booking submitted successfully", "data": Booking }
```

GET `/admin/service-bookings`
Optional query: `status`, `page`, `limit`
Response: `{ "success": true, "data": [Booking], "total": 20, "page": 1, "limit": 10 }`

PATCH `/admin/service-bookings/:id`
Request: `{ "status": "Pending|Confirmed|Scheduled|In Progress|Completed|Cancelled" }`

Booking model:
```json
{
  "_id": "…",
  "serviceId": "…",
  "serviceTitle": "AC Repair",
  "servicePrice": 149,
  "date": "2025-12-31",
  "time": "10:00 AM",
  "address": "…",
  "addressType": "myself|someoneElse",
  "contactName": "…",
  "contactPhone": "+91…",
  "paymentOption": "payNow|payLater",
  "status": "Pending",
  "createdAt": "date",
  "updatedAt": "date"
}
```

------------------------------------------------------------
VENDOR REQUESTS (Admin)
------------------------------------------------------------
GET `/admin/vendor-requests`
Response: `{ "success": true, "data": [VendorRequest] }`

------------------------------------------------------------
GENERAL IMPLEMENTATION NOTES
------------------------------------------------------------
1) Transport: JSON-only; do not accept multipart from this FE. Preserve existing images if `images` is omitted on AC updates.
2) Phone: FE formats as `+91` + 10 digits. Validate length/format server-side.
3) Pagination: include `{ total, page, limit }` for list endpoints when applicable.
4) Errors: return `{ "success": false, "message": "Human readable message" }` with proper HTTP status.
5) CORS: enable for the frontend origin in development.
6) Security: all `/admin/*` routes require JWT auth.
7) Arrays: ensure `process`, `benefits`, `keyFeatures` are stored and returned as arrays of strings.

This contract matches the current frontend and is ready for backend implementation/verification.

