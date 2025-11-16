## Backend API Specification (Frontend Integration Contract)

Base URL: `http://<your-domain>/api` (frontend uses `REACT_APP_API_URL`)
Auth: Bearer JWT required for all `/admin/*` endpoints. Public endpoints don’t require auth.
Response shape: Prefer `{ success: boolean, message?: string, data?: any, total?: number }`. The frontend tolerates either root `data` or nested `data.data`, but please keep it consistent.

---

## Auth

### POST /admin/login
- Auth: Public
- Body
```json
{ "email": "string", "password": "string" }
```
- Responses
  - 200 OK
  ```json
  { "token": "jwt", "user": { "id": "string", "name": "string", "role": "admin" } }
  ```
  - 400/401
  ```json
  { "message": "Invalid credentials" }
  ```

---

## Catalog (AC Rentals)

### GET /acs
- Auth: Public
- Query (all optional): `brand`, `capacity`, `type`, `location`, `minPrice`, `maxPrice`, `duration` (Monthly|Quarterly|Yearly)
- Response 200
```json
{ "data": [AC], "total": 123 }
```

### GET /acs/{id}
- Auth: Public
- Response 200
```json
{ "data": AC }
```

### POST /acs/{id}/inquiry
- Auth: Public
- Body
```json
{
  "acId": "string",       // must equal path {id}
  "name": "string",
  "email": "string",
  "phone": "string",      // E.164 e.g. +919999999999
  "duration": "Monthly",  // Monthly|Quarterly|Yearly
  "message": "string"
}
```
- Responses
  - 200 OK: `{ "message": "Rental inquiry submitted successfully", "data": Inquiry }`
  - 400: validation error

AC model (reference)
```json
{
  "id": "string",
  "brand": "string",
  "model": "string",
  "capacity": "string",          // e.g. "1.5 Ton"
  "type": "Split|Window",
  "description": "string",
  "location": "string",
  "status": "Available|Rented Out|Under Maintenance",
  "price": { "monthly": 0, "quarterly": 0, "yearly": 0 },
  "images": ["https://..."],
  "createdAt": "ISO8601"
}
```

---

## Services (Marketing + Bookings)

### GET /services
- Auth: Public
- Response 200
```json
{ "data": [Service] }
```
Service model
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "price": 0,
  "image": "https://...",
  "createdAt": "ISO8601"
}
```

### POST /service-bookings
- Auth: Public
- Body
```json
{
  "serviceId": "string",
  "name": "string",
  "phone": "string",          // E.164
  "preferredDate": "YYYY-MM-DD",
  "preferredTime": "HH:mm",
  "address": "string",
  "notes": "string"
}
```
- Responses
  - 200 OK: `{ "message": "Service booking submitted successfully", "data": ServiceBooking }`
  - 400: validation error

ServiceBooking model
```json
{
  "id": "string",
  "serviceId": "string",
  "name": "string",
  "phone": "string",
  "preferredDate": "YYYY-MM-DD",
  "preferredTime": "HH:mm",
  "address": "string",
  "notes": "string",
  "status": "New|Contacted|In-Progress|Resolved|Rejected",
  "createdAt": "ISO8601"
}
```

Note: The older `/service-requests` flow is NOT used by the frontend and can be omitted.

---

## Public Lead & Contact

### POST /leads
- Auth: Public
- Body
```json
{ "name": "string", "phone": "string", "message": "string" }
```
- 200 OK: `{ "message": "...", "data": Lead }`

### POST /contact
- Auth: Public
- Body
```json
{ "name": "string", "email": "string", "phone": "string", "message": "string" }
```
- 200 OK: `{ "message": "Message sent successfully" }`

### POST /vendor-listing-request
- Auth: Public
- Body
```json
{ "name": "string", "phone": "string", "businessName": "string", "message": "string" }
```
- 200 OK: `{ "message": "Request submitted successfully. We will contact you soon." }`

---

## Admin - AC Management

All require header `Authorization: Bearer <token>`.

### GET /admin/acs
- Response 200: `{ "data": [AC] }`

### POST /admin/acs
- Body
```json
{
  "brand": "string",
  "model": "string",
  "capacity": "string",
  "type": "Split|Window",
  "description": "string",
  "location": "string",
  "status": "Available|Rented Out|Under Maintenance",
  "price": { "monthly": 0, "quarterly": 0, "yearly": 0 },
  "images": ["https://..."]    // URLs already uploaded to Cloudinary by frontend
}
```
- 200 OK: `{ "message": "AC added successfully", "data": AC }`

### PATCH /admin/acs/{id}
- Body: any subset of POST fields; if `images` omitted, keep existing images server-side
- 200 OK: `{ "message": "AC updated successfully", "data": AC }`

### DELETE /admin/acs/{id}
- 200 OK: `{ "message": "AC deleted successfully" }`

---

## Admin - Leads & Inquiries

### GET /admin/service-bookings
- 200 OK: `{ "data": [ServiceBooking] }`

### PATCH /admin/service-bookings/{leadId}
- Body
```json
{ "status": "New|Contacted|In-Progress|Resolved|Rejected" }
```
- 200 OK: `{ "message": "Lead status updated", "data": ServiceBooking }`

### GET /admin/rental-inquiries
- 200 OK: `{ "data": [Inquiry] }`

### PATCH /admin/rental-inquiries/{inquiryId}
- Body
```json
{ "status": "New|Contacted|In-Progress|Resolved|Rejected" }
```
- 200 OK: `{ "message": "Inquiry status updated", "data": Inquiry }`

Inquiry model
```json
{
  "id": "string",
  "acId": "string",
  "name": "string",
  "email": "string",
  "phone": "string",
  "duration": "Monthly|Quarterly|Yearly",
  "message": "string",
  "status": "New|Contacted|In-Progress|Resolved|Rejected",
  "createdAt": "ISO8601"
}
```

---

## Admin - Services Management

### POST /admin/services
- Body
```json
{ "title": "string", "description": "string", "price": 0, "image": "https://..." }
```
- 200 OK: `{ "message": "Service added successfully", "data": Service }`

### PATCH /admin/services/{id}
- Body (partial): `{ "title"?, "description"?, "price"?, "image"? }`
- 200 OK: `{ "message": "Service updated successfully", "data": Service }`

### DELETE /admin/services/{id}
- 200 OK: `{ "message": "Service deleted successfully" }`

---

## Validation Rules (Key)
- Phone: E.164 `+` country code required (e.g., India `+91xxxxxxxxxx`).
- Dates: `YYYY-MM-DD`; Times: `HH:mm` 24-hour.
- Enum validation for: AC `type`, AC `status`, booking/inquiry `status`, rental `duration`.
- Images: Frontend uploads to Cloudinary, backend should expect URLs only.
- For PATCH endpoints: treat omitted fields as “leave unchanged.”

---

## Error Format
Use standard HTTP status codes. Body example:
```json
{ "success": false, "message": "Validation failed", "errors": [{ "field": "phone", "message": "Invalid phone" }] }
```
The frontend currently reads `message` for UX feedback.

---

## Sequences (E2E)

1) Admin adds a service
- POST `/admin/services` -> appears in GET `/services`

2) User books a service
- GET `/services` -> user selects -> POST `/service-bookings`
- Admin reviews GET `/admin/service-bookings`, updates status via PATCH

3) Admin adds an AC, user inquires, admin manages
- POST `/admin/acs` -> shows in GET `/acs`
- GET `/acs/{id}` -> POST `/acs/{id}/inquiry`
- Admin reviews GET `/admin/rental-inquiries`, updates via PATCH

---

## Not Implemented (Not needed now)
- GET `/services/{id}`
- POST `/service-requests`

These are not referenced by the current frontend.


