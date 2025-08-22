# API Connection Setup Guide

This guide explains how to connect your Next.js frontend to your Express.js backend.

## Environment Configuration

Create a `.env.local` file in the root of your `reminder-cancellation2` project with the following content:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# For production, use your actual API URL:
# NEXT_PUBLIC_API_URL=https://your-production-api.com/api
```

## Backend API Endpoints

Your Express.js backend should implement the following endpoints:

### Authentication Endpoints

1. **POST /api/auth/register**
   - Body: `{ firstName, lastName, email, password }`
   - Response: `{ user, token, message }`

2. **POST /api/auth/login**
   - Body: `{ email, password }`
   - Response: `{ user, token, message }`

3. **POST /api/auth/logout**
   - Headers: `Authorization: Bearer <token>`
   - Response: `{ message: "Logged out successfully" }`

4. **GET /api/auth/me**
   - Headers: `Authorization: Bearer <token>`
   - Response: `{ user }`

### User Object Structure

The backend should return user objects with this structure:

```typescript
interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}
```

## CORS Configuration

Make sure your Express.js backend has CORS enabled for your frontend domain:

```javascript
const cors = require('cors');

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
```

## JWT Token Structure

The backend should:
1. Generate JWT tokens on successful login/register
2. Include the token in the response
3. Verify tokens on protected routes using middleware

## Usage Examples

### Login
```typescript
import { apiService } from '@/api/api';

try {
    const response = await apiService.login({
        email: 'user@example.com',
        password: 'password123'
    });
    console.log('Logged in:', response.user);
} catch (error) {
    console.error('Login failed:', error.message);
}
```

### Register
```typescript
import { apiService } from '@/api/api';

try {
    const response = await apiService.register({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123'
    });
    console.log('Registered:', response.user);
} catch (error) {
    console.error('Registration failed:', error.message);
}
```

### Check Authentication Status
```typescript
import { apiService } from '@/api/api';

if (apiService.isAuthenticated()) {
    const user = apiService.getStoredUser();
    console.log('Current user:', user);
}
```

### Logout
```typescript
import { apiService } from '@/api/api';

await apiService.logout();
// User will be redirected to login page automatically
```

## Error Handling

The API service automatically handles:
- Network errors
- Authentication errors (401 responses)
- Token expiration
- Automatic redirects to login page

## Security Notes

1. Always use HTTPS in production
2. Implement proper password hashing on the backend
3. Set appropriate JWT expiration times
4. Use secure cookie settings if using cookies
5. Implement rate limiting on authentication endpoints

## Testing the Connection

1. Start your Express.js backend (typically on port 3001)
2. Start your Next.js frontend (typically on port 3000)
3. Try registering a new user
4. Try logging in with the registered user
5. Check that the JWT token is stored in localStorage
6. Verify that protected routes work correctly
