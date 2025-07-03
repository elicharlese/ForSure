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
    bio: 'System administrator for ForSure platform'
  },
  {
    email: 'moderator@forsure.app',
    name: 'Moderator User',
    role: 'moderator',
    bio: 'Community moderator'
  },
  {
    email: 'user@forsure.app',
    name: 'Test User',
    role: 'user',
    bio: 'Regular platform user'
  }
]

const seedProjects = [
  {
    name: 'Sample Project',
    description: 'A sample project to demonstrate ForSure capabilities',
    slug: 'sample-project',
    status: 'active',
    visibility: 'public',
    tags: ['sample', 'demo', 'tutorial']
  },
  {
    name: 'Advanced Dashboard',
    description: 'Complex dashboard with multiple data sources',
    slug: 'advanced-dashboard',
    status: 'active',
    visibility: 'public',
    tags: ['dashboard', 'analytics', 'charts']
  }
]

const seedBlogPosts = [
  {
    title: 'Welcome to ForSure',
    content: 'This is an introduction to the ForSure platform and its capabilities.',
    excerpt: 'Learn about ForSure platform features and how to get started.',
    slug: 'welcome-to-forsure',
    status: 'published',
    tags: ['welcome', 'introduction', 'guide']
  },
  {
    title: 'Building Your First Project',
    content: 'Step-by-step guide to creating your first project on ForSure.',
    excerpt: 'A comprehensive guide for beginners to start their first project.',
    slug: 'building-your-first-project',
    status: 'published',
    tags: ['tutorial', 'beginner', 'project']
  }
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
        const { error } = await supabaseAdmin
          .from('profiles')
          .insert({
            id: `seed-${user.email.split('@')[0]}`,
            email: user.email,
            name: user.name,
            role: user.role,
            bio: user.bio,
            is_verified: true
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
      for (const project of seedProjects) {
        const { data: existingProject } = await supabaseAdmin
          .from('projects')
          .select('slug')
          .eq('slug', project.slug)
          .single()

        if (!existingProject) {
          const { error } = await supabaseAdmin
            .from('projects')
            .insert({
              ...project,
              owner_id: adminUser.id,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })

          if (error) {
            console.error(`Error seeding project ${project.name}:`, error)
          } else {
            console.log(`✅ Created project: ${project.name}`)
          }
        } else {
          console.log(`⏭️  Project already exists: ${project.name}`)
        }
      }

      // Seed blog posts
      console.log('📰 Seeding blog posts...')
      for (const post of seedBlogPosts) {
        const { data: existingPost } = await supabaseAdmin
          .from('blog_posts')
          .select('slug')
          .eq('slug', post.slug)
          .single()

        if (!existingPost) {
          const { error } = await supabaseAdmin
            .from('blog_posts')
            .insert({
              ...post,
              author_id: adminUser.id,
              published_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
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
    }

    console.log('🎉 Database seeding completed successfully!')
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

export { seedDatabase }
