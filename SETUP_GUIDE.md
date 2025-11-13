# Quick Setup Guide

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Environment Variables

Create a `.env` file in the root directory. See `ENV_SETUP.md` for details.

Minimum required variables:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/coolrentals
JWT_SECRET=your-secret-key-change-in-production
FRONTEND_URL=http://localhost:3000
```

## Step 3: Start MongoDB

If using local MongoDB:
```bash
mongod
```

Or use MongoDB Atlas (cloud) and update `MONGODB_URI` in `.env`.

## Step 4: Create Admin User

```bash
npm run create-admin "Admin Name" "admin@example.com" "password123"
```

Or manually:
```bash
node scripts/createAdmin.js "Admin Name" "admin@example.com" "password123"
```

## Step 5: Start the Server

Development mode (with auto-restart):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## Step 6: Verify Setup

Check if the server is running:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running"
}
```

## Testing the API

### Test Admin Login

```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

### Test Get All ACs

```bash
curl http://localhost:5000/api/acs
```

## Next Steps

1. Configure email notifications (optional) - See `ENV_SETUP.md`
2. Set up Cloudinary for image storage (optional) - Update `utils/upload.js`
3. Configure CORS for your frontend URL
4. Set up production environment variables

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Verify MongoDB connection string format

### Port Already in Use
- Change `PORT` in `.env`
- Or stop the process using port 5000

### Image Upload Issues
- Make sure `uploads/` directory exists (created automatically)
- Check file permissions
- Verify file size (max 5MB per image)

### Authentication Errors
- Verify JWT_SECRET is set in `.env`
- Check token expiration
- Ensure admin user exists

## API Documentation

See `BACKEND_API.md` for complete API documentation.

## Support

For issues or questions, refer to:
- `README.md` - General documentation
- `ENV_SETUP.md` - Environment variables setup
- `BACKEND_API.md` - API endpoint documentation

