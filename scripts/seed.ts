import { supabaseAdmin } from '../lib/supabase'

interface SeedUser {
  email: string
  name: string
  role: 'user' | 'admin' | 'moderator'
  bio?: string
}

const seedUsers: SeedUser[] = [
  {
    email: 'admin@forsure.app',
    name: 'Admin User',
    role: 'admin',
    bio: 'System administrator for ForSure platform',
  },
  {
    email: 'moderator@forsure.app',
    name: 'Moderator User',
    role: 'moderator',
    bio: 'Community moderator',
  },
  {
    email: 'user@forsure.app',
    name: 'Test User',
    role: 'user',
    bio: 'Regular platform user',
  },
]

const seedProjects = [
  {
    name: 'Sample Project',
    description: 'A sample project to demonstrate ForSure capabilities',
    slug: 'sample-project',
    status: 'active',
    visibility: 'public',
    tags: ['sample', 'demo', 'tutorial'],
  },
  {
    name: 'Advanced Dashboard',
    description: 'Complex dashboard with multiple data sources',
    slug: 'advanced-dashboard',
    status: 'active',
    visibility: 'public',
    tags: ['dashboard', 'analytics', 'charts'],
  },
]

const seedBlogPosts = [
  {
    title: 'Welcome to ForSure',
    content:
      'This is an introduction to the ForSure platform and its capabilities.',
    excerpt: 'Learn about ForSure platform features and how to get started.',
    slug: 'welcome-to-forsure',
    status: 'published',
    tags: ['welcome', 'introduction', 'guide'],
  },
  {
    title: 'Building Your First Project',
    content: 'Step-by-step guide to creating your first project on ForSure.',
    excerpt:
      'A comprehensive guide for beginners to start their first project.',
    slug: 'building-your-first-project',
    status: 'published',
    tags: ['tutorial', 'beginner', 'project'],
  },
]

const seedTemplates = [
  {
    name: 'Basic React Component',
    description: 'A simple React component template with TypeScript',
    category: 'React',
    content: {
      type: 'component',
      language: 'typescript',
      code: `import React from 'react';\n\ninterface Props {\n  title: string;\n}\n\nconst Component: React.FC<Props> = ({ title }) => {\n  return <div>{title}</div>;\n};\n\nexport default Component;`,
    },
    tags: ['react', 'typescript', 'component'],
    is_public: true,
  },
  {
    name: 'Next.js API Route',
    description: 'Template for Next.js API route with TypeScript',
    category: 'API',
    content: {
      type: 'api',
      language: 'typescript',
      code: `import { NextRequest, NextResponse } from 'next/server';\n\nexport async function GET(request: NextRequest) {\n  return NextResponse.json({ message: 'Hello World' });\n}\n\nexport async function POST(request: NextRequest) {\n  const body = await request.json();\n  return NextResponse.json({ data: body });\n}`,
    },
    tags: ['nextjs', 'api', 'typescript'],
    is_public: true,
  },
]

const seedTeams = [
  {
    name: 'ForSure Core Team',
    description: 'Core development team for ForSure platform',
    slug: 'forsure-core-team',
    is_public: true,
    settings: {
      permissions: {
        canCreateProjects: true,
        canManageMembers: true,
        canDeleteTeam: false,
      },
    },
  },
  {
    name: 'Community Contributors',
    description: 'Open source contributors and community members',
    slug: 'community-contributors',
    is_public: true,
    settings: {
      permissions: {
        canCreateProjects: true,
        canManageMembers: false,
        canDeleteTeam: false,
      },
    },
  },
]

const seedTasks = [
  {
    title: 'Set up project structure',
    description:
      'Initialize the project with proper folder structure and configuration',
    status: 'done',
    priority: 'high',
    estimated_hours: 4,
    actual_hours: 3.5,
    tags: ['setup', 'initialization'],
  },
  {
    title: 'Implement authentication',
    description: 'Add user authentication using Supabase Auth',
    status: 'done',
    priority: 'high',
    estimated_hours: 8,
    actual_hours: 6,
    tags: ['auth', 'security'],
  },
  {
    title: 'Create user dashboard',
    description: 'Build the main user dashboard with project overview',
    status: 'in_progress',
    priority: 'medium',
    estimated_hours: 12,
    tags: ['frontend', 'dashboard'],
  },
  {
    title: 'Add blockchain integration',
    description: 'Integrate Solana blockchain functionality',
    status: 'todo',
    priority: 'medium',
    estimated_hours: 16,
    tags: ['blockchain', 'solana'],
  },
]

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...')

    // Seed users (profiles)
    console.log('📝 Seeding users...')
    for (const user of seedUsers) {
      const { data: existingUser } = await supabaseAdmin
        .from('profiles')
        .select('email')
        .eq('email', user.email)
        .single()

      if (!existingUser) {
        const { error } = await supabaseAdmin.from('profiles').insert({
          id: `seed-${user.email.split('@')[0]}`,
          email: user.email,
          name: user.name,
          role: user.role,
          bio: user.bio,
          is_verified: true,
        })

        if (error) {
          console.error(`Error seeding user ${user.email}:`, error)
        } else {
          console.log(`✅ Created user: ${user.email}`)
        }
      } else {
        console.log(`⏭️  User already exists: ${user.email}`)
      }
    }

    // Get admin user for creating projects and blogs
    const { data: adminUser } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', 'admin@forsure.app')
      .single()

    if (adminUser) {
      // Seed projects
      console.log('📁 Seeding projects...')
      const createdProjects = []
      for (const project of seedProjects) {
        const { data: existingProject } = await supabaseAdmin
          .from('projects')
          .select('slug')
          .eq('slug', project.slug)
          .single()

        if (!existingProject) {
          const { data: newProject, error } = await supabaseAdmin
            .from('projects')
            .insert({
              ...project,
              owner_id: adminUser.id,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .select()
            .single()

          if (error) {
            console.error(`Error seeding project ${project.name}:`, error)
          } else {
            console.log(`✅ Created project: ${project.name}`)
            createdProjects.push(newProject)
          }
        } else {
          console.log(`⏭️  Project already exists: ${project.name}`)
        }
      }

      // Seed teams
      console.log('👥 Seeding teams...')
      const createdTeams = []
      for (const team of seedTeams) {
        const { data: existingTeam } = await supabaseAdmin
          .from('teams')
          .select('slug')
          .eq('slug', team.slug)
          .single()

        if (!existingTeam) {
          const { data: newTeam, error } = await supabaseAdmin
            .from('teams')
            .insert({
              ...team,
              owner_id: adminUser.id,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .select()
            .single()

          if (error) {
            console.error(`Error seeding team ${team.name}:`, error)
          } else {
            console.log(`✅ Created team: ${team.name}`)
            createdTeams.push(newTeam)
          }
        } else {
          console.log(`⏭️  Team already exists: ${team.name}`)
        }
      }

      // Seed tasks for first project
      if (createdProjects.length > 0) {
        console.log('📋 Seeding tasks...')
        const firstProject = createdProjects[0]

        for (const task of seedTasks) {
          const { error } = await supabaseAdmin.from('tasks').insert({
            ...task,
            project_id: firstProject.id,
            reporter_id: adminUser.id,
            assignee_id: adminUser.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })

          if (error) {
            console.error(`Error seeding task ${task.title}:`, error)
          } else {
            console.log(`✅ Created task: ${task.title}`)
          }
        }
      }

      // Seed templates
      console.log('� Seeding templates...')
      for (const template of seedTemplates) {
        const { data: existingTemplate } = await supabaseAdmin
          .from('templates')
          .select('name')
          .eq('name', template.name)
          .single()

        if (!existingTemplate) {
          const { error } = await supabaseAdmin.from('templates').insert({
            ...template,
            creator_id: adminUser.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })

          if (error) {
            console.error(`Error seeding template ${template.name}:`, error)
          } else {
            console.log(`✅ Created template: ${template.name}`)
          }
        } else {
          console.log(`⏭️  Template already exists: ${template.name}`)
        }
      }

      // Seed blog posts
      console.log('�📰 Seeding blog posts...')
      for (const post of seedBlogPosts) {
        const { data: existingPost } = await supabaseAdmin
          .from('blog_posts')
          .select('slug')
          .eq('slug', post.slug)
          .single()

        if (!existingPost) {
          const { error } = await supabaseAdmin.from('blog_posts').insert({
            ...post,
            author_id: adminUser.id,
            published_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })

          if (error) {
            console.error(`Error seeding blog post ${post.title}:`, error)
          } else {
            console.log(`✅ Created blog post: ${post.title}`)
          }
        } else {
          console.log(`⏭️  Blog post already exists: ${post.title}`)
        }
      }

      // Seed notifications for users
      console.log('🔔 Seeding notifications...')
      const users = await supabaseAdmin.from('profiles').select('id').limit(3)

      if (users.data) {
        for (const user of users.data) {
          const notifications = [
            {
              user_id: user.id,
              type: 'welcome',
              title: 'Welcome to ForSure!',
              message:
                'Welcome to the ForSure platform. Start by exploring the dashboard.',
              data: { action: 'dashboard' },
              action_url: '/app',
            },
            {
              user_id: user.id,
              type: 'project',
              title: 'New Project Available',
              message: 'Check out the sample project to see ForSure in action.',
              data: { project_id: 'sample-project' },
              action_url: '/app/projects/sample-project',
            },
          ]

          for (const notification of notifications) {
            const { error } = await supabaseAdmin.from('notifications').insert({
              ...notification,
              created_at: new Date().toISOString(),
            })

            if (error) {
              console.error(`Error seeding notification:`, error)
            }
          }
        }
        console.log(`✅ Created notifications for ${users.data.length} users`)
      }
    }

    console.log('🎉 Database seeding completed successfully!')
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

// Run the seed function
seedDatabase()
  .then(() => {
    console.log('✅ Seeding completed successfully!')
    if (typeof process !== 'undefined') {
      process.exit(0)
    }
  })
  .catch(error => {
    console.error('❌ Seeding failed:', error)
    if (typeof process !== 'undefined') {
      process.exit(1)
    }
  })

export { seedDatabase }
