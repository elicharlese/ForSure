# ForSure Backend Implementation

This document outlines the complete backend implementation for the ForSure application.

## Overview

ForSure is a Next.js application with a full-stack backend implementation featuring:
- JWT-based authentication with HTTP-only cookies
- MongoDB database with Mongoose ODM
- RESTful API endpoints for projects, teams, and file structures
- AI chat functionality for project assistance
- Real-time collaboration features

## Architecture

### Database Models

#### User Model (`/models/User.ts`)
- User authentication and profile management
- Fields: email, name, password (hashed), avatar, role, timestamps
- Indexes on email and creation date

#### Project Model (`/models/Project.ts`)
- Project management with version control
- File structure storage and ForSure file management
- Collaboration features with owner/collaborator roles
- Fields: name, type, framework, languages, description, file structure, versions

#### Team Model (`/models/Team.ts`)
- Team collaboration and project sharing
- Member management with roles (admin/member)
- Project association and access control

### API Endpoints

#### Authentication (`/app/api/auth/`)
- `POST /api/auth/login` - User login with JWT token
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - Logout and token cleanup
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/me` - Update user profile

#### Projects (`/app/api/projects/`)
- `GET /api/projects` - List user projects with pagination and search
- `POST /api/projects` - Create new project
- `GET /api/projects/[id]` - Get single project details
- `PUT /api/projects/[id]` - Update project (creates new version)
- `DELETE /api/projects/[id]` - Delete project (owner only)

#### Teams (`/app/api/teams/`)
- `GET /api/teams` - List user teams
- `POST /api/teams` - Create new team

#### Chat (`/app/api/chat/`)
- `POST /api/chat` - AI chat for project assistance and structure generation

#### File Structure (`/app/api/file-structure/`)
- `POST /api/file-structure` - Generate file structure from ForSure content

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file based on `.env.example`:

```bash
cp .env.example .env.local
```

Required variables:
```env
MONGODB_URI=mongodb://localhost:27017/forsure
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 2. Install Dependencies

```bash
npm install
```

New backend dependencies added:
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT token management
- `@types/bcryptjs` - TypeScript types
- `@types/jsonwebtoken` - TypeScript types

### 3. Database Setup

#### Local MongoDB
```bash
# Install MongoDB locally or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

#### MongoDB Atlas (Cloud)
1. Create account at https://cloud.mongodb.com
2. Create cluster and get connection string
3. Update `MONGODB_URI` in `.env.local`

### 4. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## API Usage Examples

### Authentication

#### Register a new user
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","name":"John Doe","password":"password123"}'
```

#### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}' \
  -c cookies.txt
```

#### Get current user
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -b cookies.txt
```

### Projects

#### Create a project
```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "My Next.js App",
    "type": "Web Application",
    "framework": "Next.js",
    "languages": ["TypeScript", "React"],
    "description": "A modern web application",
    "industry": "Technology",
    "stage": "Development",
    "teamSize": "1-5",
    "timeline": "3-6 months",
    "goals": ["Build MVP", "Launch product"]
  }'
```

#### List projects
```bash
curl -X GET "http://localhost:3000/api/projects?page=1&limit=10" \
  -b cookies.txt
```

### AI Chat

#### Chat with AI assistant
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "message": "Help me structure my Next.js project",
    "projectContext": {
      "name": "My App",
      "framework": "Next.js",
      "type": "Web Application"
    }
  }'
```

## Security Features

### Authentication
- JWT tokens stored in HTTP-only cookies
- Password hashing with bcrypt
- Token expiration (7 days default)
- Secure cookie settings for production

### Authorization
- Route-level authentication middleware
- Project ownership and collaboration checks
- Role-based access control (user/admin)

### Data Validation
- Input sanitization and validation
- MongoDB injection prevention
- XSS protection through proper data handling

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique, indexed),
  name: String,
  password: String (hashed, not selected by default),
  avatar: String (optional),
  role: String (enum: 'user', 'admin'),
  createdAt: Date,
  lastLogin: Date,
  isEmailVerified: Boolean,
  resetPasswordToken: String (optional),
  resetPasswordExpires: Date (optional)
}
```

### Projects Collection
```javascript
{
  _id: ObjectId,
  name: String,
  type: String,
  framework: String,
  languages: [String],
  description: String,
  industry: String,
  stage: String,
  teamSize: String,
  timeline: String,
  goals: [String],
  owner: ObjectId (ref: User),
  collaborators: [ObjectId] (ref: User),
  fileStructure: Mixed,
  forSureFiles: [{
    name: String,
    content: String,
    isActive: Boolean,
    createdAt: Date,
    updatedAt: Date
  }],
  tags: [String],
  isPublic: Boolean,
  createdAt: Date,
  updatedAt: Date,
  lastAccessedAt: Date,
  version: Number,
  versions: [{
    version: Number,
    fileStructure: Mixed,
    forSureFiles: Mixed,
    createdAt: Date,
    createdBy: ObjectId (ref: User),
    description: String
  }]
}
```

### Teams Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  owner: ObjectId (ref: User),
  members: [{
    user: ObjectId (ref: User),
    role: String (enum: 'admin', 'member'),
    joinedAt: Date
  }],
  projects: [ObjectId] (ref: Project),
  isPublic: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Frontend Integration

The frontend auth context (`/contexts/auth-context.tsx`) has been updated to use the real API endpoints:

- Login/register forms now make actual API calls
- Session persistence through HTTP-only cookies
- Automatic session restoration on page load
- Profile updates through API

## Development Notes

### File Structure
```
/app/api/
├── auth/
│   ├── login/route.ts
│   ├── register/route.ts
│   ├── logout/route.ts
│   └── me/route.ts
├── projects/
│   ├── route.ts
│   └── [id]/route.ts
├── teams/
│   └── route.ts
├── chat/
│   └── route.ts
└── file-structure/
    └── route.ts

/models/
├── User.ts
├── Project.ts
└── Team.ts

/lib/
├── db.ts
└── auth.ts
```

### Error Handling
- Consistent error response format
- Proper HTTP status codes
- Detailed error logging
- Client-friendly error messages

### Performance Considerations
- Database indexes on frequently queried fields
- Pagination for large datasets
- Efficient population of related documents
- Connection pooling with Mongoose

## Next Steps

1. **Testing**: Add comprehensive test suite
2. **Email Integration**: Implement email verification and password reset
3. **File Upload**: Add avatar and file upload functionality
4. **Real-time Features**: Implement WebSocket for live collaboration
5. **Caching**: Add Redis for session and data caching
6. **Monitoring**: Add logging and monitoring tools
7. **Deployment**: Configure for production deployment

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check if MongoDB is running
   - Verify connection string in `.env.local`
   - Ensure network access for MongoDB Atlas

2. **JWT Token Issues**
   - Verify `JWT_SECRET` is set
   - Check cookie settings in browser
   - Ensure HTTPS in production

3. **CORS Issues**
   - Configure Next.js API routes properly
   - Check cookie settings for cross-origin requests

4. **TypeScript Errors**
   - Ensure all type definitions are installed
   - Check import paths and model exports