# ForSure API Documentation

## Overview

The ForSure application provides a RESTful API built with Next.js API routes, integrated with Supabase for authentication and data storage. All endpoints require proper authentication unless specified otherwise.

## Authentication

### Base URL
- Development: `http://localhost:3000/api`
- Production: `https://your-app.vercel.app/api`

### Authentication Header
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-supabase-jwt-token>
```

## Rate Limiting

- **Auth endpoints**: 5 requests per 15 minutes
- **General API endpoints**: 100 requests per 15 minutes
- **Upload endpoints**: 10 requests per hour

## Response Format

All API responses follow this consistent format:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "meta": { ... } // Optional metadata
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": { ... } // Optional error details
}
```

## Endpoints

### Authentication

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user"
    },
    "message": "Registration successful. Please check your email to verify your account."
  }
}
```

#### POST /api/auth/login
Authenticate user and return session.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user"
    },
    "session": {
      "access_token": "jwt-token",
      "expires_at": 1234567890
    }
  }
}
```

#### POST /api/auth/logout
Logout current user session.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

#### GET /api/auth/me
Get current user information.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "avatar_url": "https://...",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### User Management

#### GET /api/users/profile
Get current user's profile.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "bio": "Full-stack developer",
    "avatar_url": "https://...",
    "company": "Tech Corp",
    "location": "San Francisco",
    "skills": ["JavaScript", "React", "Node.js"],
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

#### PUT /api/users/profile
Update current user's profile.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "John Smith",
  "bio": "Senior Full-stack developer",
  "company": "New Tech Corp",
  "location": "New York",
  "skills": ["JavaScript", "React", "Node.js", "Python"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    // Updated profile data
  }
}
```

### Projects

#### GET /api/projects
Get user's projects with pagination.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10, max: 50)
- `search` (string): Search in title and description
- `sort` (string): Sort field (default: created_at)
- `order` (string): Sort order - asc/desc (default: desc)
- `status` (string): Filter by status - active/archived/draft/completed

**Response:**
```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": "uuid",
        "name": "My Project",
        "description": "Project description",
        "slug": "my-project",
        "status": "active",
        "visibility": "private",
        "owner_id": "uuid",
        "tech_stack": ["React", "Node.js"],
        "tags": ["web", "app"],
        "progress": 75,
        "created_at": "2024-01-01T00:00:00Z",
        "profiles": {
          "name": "John Doe",
          "avatar_url": "https://..."
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

#### POST /api/projects
Create a new project.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "New Project",
  "description": "Project description",
  "tech_stack": ["React", "Node.js"],
  "tags": ["web", "app"],
  "visibility": "private",
  "repository_url": "https://github.com/user/repo"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    // Created project data
  }
}
```

#### GET /api/projects/[id]
Get a specific project by ID.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    // Project data with full details
  }
}
```

#### PUT /api/projects/[id]
Update a project.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Updated Project Name",
  "description": "Updated description",
  "status": "completed",
  "progress": 100
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    // Updated project data
  }
}
```

#### DELETE /api/projects/[id]
Delete a project.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Project deleted successfully"
  }
}
```

### File Upload

#### POST /api/upload
Upload a file to Supabase Storage.

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Request Body:**
- `file`: File to upload
- `bucket`: Storage bucket name (optional, default: uploads)
- `path`: File path in bucket (optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "filename": "file-123.jpg",
    "original_filename": "my-image.jpg",
    "file_size": 1024000,
    "mime_type": "image/jpeg",
    "file_url": "https://supabase-storage-url/file-123.jpg",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

## Error Codes

- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **422 Unprocessable Entity**: Validation errors
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server error

## Validation Schemas

All request bodies are validated using Zod schemas. Common validation rules:

### User Registration
```typescript
{
  email: string (valid email format)
  password: string (min 8 chars, must contain uppercase, lowercase, number)
  name: string (min 2 chars, max 50 chars)
}
```

### Project Creation
```typescript
{
  name: string (min 3 chars, max 100 chars)
  description: string (optional, max 500 chars)
  tech_stack: string[] (optional, max 10 items)
  tags: string[] (optional, max 5 items)
  visibility: 'public' | 'private' | 'unlisted'
  repository_url: string (optional, valid URL)
}
```

## Rate Limiting Headers

When rate limits are applied, responses include these headers:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: Time when the limit resets
- `Retry-After`: Seconds to wait before retrying (on 429 errors)

## Development Notes

### Environment Variables Required
```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
JWT_SECRET=your-jwt-secret
```

### Database Setup
Run the SQL schema from `database-schema.sql` in your Supabase SQL editor to set up all required tables and policies.

### Testing
Use tools like Postman, Insomnia, or curl to test the API endpoints:

```bash
# Login example
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get projects example
curl -X GET http://localhost:3000/api/projects \
  -H "Authorization: Bearer your-jwt-token"
```
