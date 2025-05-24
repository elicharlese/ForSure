# ForSure

> A modern, full-stack web application built with Next.js 15, featuring advanced animations, authentication, and AI-powered features.

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.15.0-green?style=flat-square&logo=mongodb)](https://www.mongodb.com/)

## ✨ Features

- **🚀 Modern Stack**: Built with Next.js 15, React 19, and TypeScript
- **⚡ Turbopack**: Lightning-fast development with Turbopack bundler
- **🎨 Beautiful UI**: Responsive design with Tailwind CSS and Radix UI components
- **🔐 Authentication**: Secure JWT-based authentication system
- **📊 Database**: MongoDB integration with Mongoose ODM
- **🎭 Animations**: Smooth animations powered by GSAP and Framer Motion
- **🌙 Dark Mode**: Built-in dark/light theme support
- **📱 Responsive**: Mobile-first responsive design
- **🔍 Search**: Advanced search functionality
- **📝 Blog**: Built-in blog system
- **💼 Career Pages**: Job listings and career information
- **📚 Documentation**: Comprehensive docs with interactive examples
- **🤖 AI Features**: AI-powered functionality and chat system

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.2.4 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4.17
- **UI Components**: Radix UI primitives
- **Animations**: GSAP, Framer Motion
- **Forms**: React Hook Form with Zod validation
- **State Management**: React Context API
- **Theme**: next-themes for dark/light mode

### Backend
- **Runtime**: Node.js with Next.js API routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcryptjs
- **Validation**: Zod schema validation
- **File Upload**: Built-in file handling

### Development Tools
- **Bundler**: Turbopack (development) / Webpack (production)
- **Linting**: ESLint with Next.js config
- **Package Manager**: npm/pnpm
- **Version Control**: Git

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/elicharlese/ForSure.git
   cd ForSure
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your environment variables:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/forsure
   
   # Authentication
   JWT_SECRET=your-super-secret-jwt-key-here
   
   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NODE_ENV=development
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or with Turbopack (recommended)
   npm run turbo
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
ForSure/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── projects/      # Project management
│   │   ├── chat/          # AI chat functionality
│   │   └── users/         # User management
│   ├── (pages)/           # Application pages
│   │   ├── about/         # About page
│   │   ├── blog/          # Blog system
│   │   ├── careers/       # Career pages
│   │   ├── docs/          # Documentation
│   │   └── ...
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── animated-*.tsx    # Animation components
│   ├── docs-*.tsx        # Documentation components
│   └── ...
├── contexts/             # React contexts
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
│   ├── auth.ts           # Authentication utilities
│   ├── db.ts             # Database connection
│   └── utils.ts          # General utilities
├── models/               # Database models
│   ├── User.ts           # User model
│   ├── Project.ts        # Project model
│   └── Team.ts           # Team model
├── public/               # Static assets
└── styles/               # Additional styles
```

## 🔧 Development

### Available Scripts

```bash
# Development with Turbopack (recommended)
npm run dev

# Development with Webpack
npm run dev:webpack

# Production build
npm run build

# Start production server
npm run start

# Lint code
npm run lint

# Turbopack development (alias)
npm run turbo
```

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Required
MONGODB_URI=mongodb://localhost:27017/forsure
JWT_SECRET=your-super-secret-jwt-key-here

# Optional
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

## 🔐 Authentication

The application includes a complete authentication system:

- **Registration**: `/register`
- **Login**: `/login`
- **Password Reset**: `/forgot-password`
- **Protected Routes**: Automatic redirection for authenticated content
- **JWT Tokens**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage

### API Endpoints

```
POST /api/auth/register    # User registration
POST /api/auth/login       # User login
POST /api/auth/logout      # User logout
GET  /api/auth/me          # Get current user
POST /api/auth/refresh     # Refresh JWT token
```

## 📊 Database Models

### User Model
```typescript
{
  _id: ObjectId
  email: string
  password: string (hashed)
  name: string
  avatar?: string
  role: 'user' | 'admin'
  createdAt: Date
  updatedAt: Date
}
```

### Project Model
```typescript
{
  _id: ObjectId
  title: string
  description: string
  owner: ObjectId (User)
  collaborators: ObjectId[] (Users)
  status: 'active' | 'completed' | 'archived'
  createdAt: Date
  updatedAt: Date
}
```

## 🎨 UI Components

The application uses a comprehensive set of UI components built on Radix UI:

- **Forms**: Input, Textarea, Select, Checkbox, Radio
- **Navigation**: Dropdown, Menu, Tabs, Breadcrumb
- **Feedback**: Toast, Alert, Progress, Badge
- **Overlay**: Dialog, Popover, Tooltip, Sheet
- **Data Display**: Table, Card, Avatar, Separator

### Example Usage

```tsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export function MyComponent() {
  return (
    <Card className="p-6">
      <Input placeholder="Enter your name" />
      <Button className="mt-4">Submit</Button>
    </Card>
  )
}
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect to Vercel**
   ```bash
   npm i -g vercel
   vercel
   ```

2. **Set Environment Variables**
   Configure the following in your Vercel dashboard:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_APP_URL`

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- **Netlify**: Use the Next.js build command
- **Railway**: Connect your GitHub repository
- **DigitalOcean**: Use App Platform with Node.js
- **AWS**: Use Amplify or EC2 with PM2

## 🧪 Testing

```bash
# Run tests (when available)
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework for production
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) - Low-level UI primitives
- [GSAP](https://greensock.com/gsap/) - Professional-grade animation
- [MongoDB](https://www.mongodb.com/) - The database for modern applications

## 📞 Support

- **Documentation**: [/docs](./docs)
- **Issues**: [GitHub Issues](https://github.com/elicharlese/ForSure/issues)
- **Discussions**: [GitHub Discussions](https://github.com/elicharlese/ForSure/discussions)

---

<div align="center">
  <p>Built with ❤️ by the ForSure team</p>
  <p>
    <a href="https://github.com/elicharlese/ForSure">⭐ Star us on GitHub</a> •
    <a href="https://github.com/elicharlese/ForSure/issues">🐛 Report Bug</a> •
    <a href="https://github.com/elicharlese/ForSure/issues">✨ Request Feature</a>
  </p>
</div>