# Backend Development Guide

## Quick Start

The ForSure backend is built with Next.js API routes and Supabase. Follow these steps to get started:

### 1. Environment Setup

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Update the environment variables with your Supabase credentials:
```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
JWT_SECRET=your-random-jwt-secret
```

### 2. Database Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL schema from `database-schema.sql` in the Supabase SQL editor
3. Enable Row Level Security (RLS) for all tables

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Start Development Server

```bash
pnpm dev
```

### 5. Test API Endpoints

The API will be available at `http://localhost:3000/api/`. See `API_DOCUMENTATION.md` for complete endpoint documentation.

## Development Workflow

### API Route Structure

All API routes are in `/app/api/`:
- `/api/auth/*` - Authentication endpoints
- `/api/users/*` - User management
- `/api/projects/*` - Project CRUD operations
- `/api/upload/*` - File upload handling
- `/api/blog/*` - Blog system
- `/api/templates/*` - Template management

### Adding New Endpoints

1. Create route file: `/app/api/your-endpoint/route.ts`
2. Implement HTTP methods (GET, POST, PUT, DELETE)
3. Use authentication middleware: `withAuth()`
4. Validate input with Zod schemas
5. Add rate limiting if needed
6. Update API documentation

### Example Route Implementation

```typescript
import { NextRequest } from 'next/server'
import { withAuth } from '@/lib/auth-middleware'
import { supabase } from '@/lib/supabase'
import { apiResponse, apiError } from '@/lib/api-utils'

export const GET = withAuth(async (request: NextRequest, { user }) => {
  try {
    // Your logic here
    const data = await supabase
      .from('your_table')
      .select('*')
      .eq('user_id', user.id)
    
    return apiResponse(data)
  } catch (error) {
    return apiError('Internal server error', 500)
  }
})
```

## Testing

### Manual Testing with curl

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123!","name":"Test User"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123!"}'

# Get user profile (replace TOKEN with actual JWT)
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

### Using Frontend

The frontend auth context is already configured to work with these API endpoints. Simply start the development server and use the UI.

## Common Issues

### Build Errors
If you get Supabase errors during build:
- Ensure all environment variables are set
- Check that Supabase URL and keys are correct
- Verify database schema is properly set up

### Authentication Issues
- Ensure JWT_SECRET is set and consistent
- Check that Supabase RLS policies are correctly configured
- Verify user exists in both auth.users and profiles tables

### CORS Issues
Next.js API routes handle CORS automatically for same-origin requests. For external requests, add CORS headers as needed.

## Security Notes

- All sensitive endpoints use authentication middleware
- Input validation is handled by Zod schemas
- Rate limiting is applied to prevent abuse
- File uploads are validated and size-limited
- SQL injection is prevented by using Supabase client

## Deployment

### Vercel Deployment

1. Push code to GitHub
2. Import project in Vercel dashboard
3. Set environment variables in Vercel project settings
4. Deploy automatically

### Environment Variables for Production

Ensure these are set in your Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `JWT_SECRET`

The application will automatically use HTTPS in production and enable additional security measures.
