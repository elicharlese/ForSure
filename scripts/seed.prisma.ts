/*
  Prisma-based seed script to populate baseline data.
  - Profiles (users)
  - Project and ProjectMember
  - Team and TeamMember
  - Tasks
  - BlogPost
  - Template
  - Notification
*/

import { prisma } from '../lib/prisma'

async function main() {
  console.log('🌱 Starting Prisma seed...')

  // Upsert two profiles by unique email
  const alice = await prisma.profile.upsert({
    where: { email: 'alice@example.com' },
    update: {
      name: 'Alice Johnson',
      is_active: true,
    },
    create: {
      email: 'alice@example.com',
      name: 'Alice Johnson',
      role: 'admin',
      skills: ['TypeScript', 'React', 'Prisma'],
      is_verified: true,
      is_active: true,
    },
  })

  const bob = await prisma.profile.upsert({
    where: { email: 'bob@example.com' },
    update: {
      name: 'Bob Lee',
      is_active: true,
    },
    create: {
      email: 'bob@example.com',
      name: 'Bob Lee',
      role: 'user',
      skills: ['Node.js', 'Testing'],
      is_verified: false,
      is_active: true,
    },
  })

  console.log('✅ Profiles ready:', { alice: alice.email, bob: bob.email })

  // Project owned by Alice
  const project = await prisma.project.upsert({
    where: { slug: 'forsure-core' },
    update: {
      name: 'ForSure Core',
      status: 'active',
      visibility: 'private',
      owner_id: alice.id,
      tags: ['forsure', 'core'],
      progress: 10,
    },
    create: {
      slug: 'forsure-core',
      name: 'ForSure Core',
      description: 'Core web app for ForSure',
      owner_id: alice.id,
      status: 'active',
      visibility: 'private',
      tags: ['forsure', 'core'],
      tech_stack: ['Next.js', 'TypeScript', 'Prisma', 'Tailwind'],
      priority: 'high',
      progress: 10,
    },
  })

  // Ensure Bob is a member of the project
  await prisma.projectMember.upsert({
    where: {
      // composite unique enforced via @@unique(project_id, user_id)
      project_id_user_id: {
        project_id: project.id,
        user_id: bob.id,
      },
    },
    update: {
      role: 'member',
    },
    create: {
      project_id: project.id,
      user_id: bob.id,
      role: 'member',
      permissions: ['read', 'comment'],
    },
  })

  console.log('✅ Project and membership set')

  // Team owned by Alice
  const team = await prisma.team.upsert({
    where: { slug: 'core-team' },
    update: {
      name: 'Core Team',
      owner_id: alice.id,
      is_public: false,
    },
    create: {
      slug: 'core-team',
      name: 'Core Team',
      owner_id: alice.id,
      is_public: false,
    },
  })

  // Add Bob to team
  await prisma.teamMember.upsert({
    where: {
      team_id_user_id: {
        team_id: team.id,
        user_id: bob.id,
      },
    },
    update: { role: 'member' },
    create: {
      team_id: team.id,
      user_id: bob.id,
      role: 'member',
    },
  })

  console.log('✅ Team and membership set')

  // Create two tasks if not present
  const existingTask1 = await prisma.task.findFirst({
    where: { project_id: project.id, title: 'Set up CI' },
  })
  if (!existingTask1) {
    await prisma.task.create({
      data: {
        project_id: project.id,
        title: 'Set up CI',
        description: 'Configure CI pipeline and tests',
        status: 'in_progress',
        priority: 'high',
        assignee_id: alice.id,
        reporter_id: bob.id,
        tags: ['ci', 'tests'],
      },
    })
  }

  const existingTask2 = await prisma.task.findFirst({
    where: { project_id: project.id, title: 'Initial layout' },
  })
  if (!existingTask2) {
    await prisma.task.create({
      data: {
        project_id: project.id,
        title: 'Initial layout',
        description: 'Build initial UI shell with Tailwind',
        status: 'todo',
        priority: 'medium',
        assignee_id: bob.id,
        reporter_id: alice.id,
        tags: ['ui', 'tailwind'],
      },
    })
  }

  console.log('✅ Tasks created')

  // Blog post by Alice
  await prisma.blogPost.upsert({
    where: { slug: 'welcome-to-forsure' },
    update: {
      title: 'Welcome to ForSure',
      status: 'published',
      author_id: alice.id,
    },
    create: {
      slug: 'welcome-to-forsure',
      title: 'Welcome to ForSure',
      content: 'This is our first post about the ForSure project!',
      excerpt: 'Introducing ForSure',
      status: 'published',
      author_id: alice.id,
      tags: ['announcement'],
    },
  })

  console.log('✅ Blog post ready')

  // Template by Alice (use findFirst + create since no unique constraint)
  const existingTemplate = await prisma.template.findFirst({
    where: { name: 'Project README', creator_id: alice.id },
  })
  if (!existingTemplate) {
    await prisma.template.create({
      data: {
        name: 'Project README',
        category: 'docs',
        content: { markdown: '# Project README\nDescribe your project here.' },
        creator_id: alice.id,
        is_public: true,
        tags: ['docs'],
      },
    })
  }

  console.log('✅ Template ready')

  // Components (seed sample)
  const componentsData = [
    {
      slug: 'dashboard-template',
      name: 'Dashboard Template',
      description:
        'Complete admin dashboard with sidebar, charts, and data tables',
      category: 'layout',
      tags: ['admin', 'dashboard', 'charts'],
      prompt: `dashboard:\n  layout: admin-sidebar\n  components:\n    - navigation-sidebar\n    - header-bar\n    - main-content\n    - chart-widgets\n    - data-tables`,
      download_count: 1247,
      stars: 89,
    },
    {
      slug: 'auth-forms',
      name: 'Authentication Forms',
      description: 'Login, register, and password reset forms with validation',
      category: 'forms',
      tags: ['auth', 'forms', 'validation'],
      prompt: `auth-system:\n  forms:\n    - login-form\n    - register-form\n    - forgot-password\n  validation: zod\n  styling: tailwind`,
      download_count: 892,
      stars: 67,
    },
    {
      slug: 'landing-page',
      name: 'Landing Page Kit',
      description: 'Modern landing page with hero, features, and CTA sections',
      category: 'layout',
      tags: ['landing', 'marketing', 'hero'],
      prompt: `landing-page:\n  sections:\n    - hero-section\n    - features-grid\n    - testimonials\n    - pricing-table\n    - cta-section\n  style: modern`,
      download_count: 1456,
      stars: 112,
    },
    {
      slug: 'data-table',
      name: 'Advanced Data Table',
      description: 'Sortable, filterable data table with pagination and search',
      category: 'data',
      tags: ['table', 'data', 'pagination'],
      prompt: `data-table:\n  features:\n    - sorting\n    - filtering\n    - pagination\n    - search\n  data-source: api\n  styling: shadcn`,
      download_count: 734,
      stars: 45,
    },
  ]

  for (const c of componentsData) {
    await prisma.component.upsert({
      where: { slug: c.slug },
      update: {
        name: c.name,
        description: c.description,
        category: c.category,
        tags: c.tags,
        prompt: c.prompt,
        preview_image_url: '/fs-logo.png',
        is_public: true,
        creator_id: alice.id,
        download_count: c.download_count,
        stars: c.stars,
      },
      create: {
        slug: c.slug,
        name: c.name,
        description: c.description,
        category: c.category,
        tags: c.tags,
        prompt: c.prompt,
        preview_image_url: '/fs-logo.png',
        is_public: true,
        creator_id: alice.id,
        download_count: c.download_count,
        stars: c.stars,
      },
    })
  }

  console.log('✅ Components ready')

  // Notification to Bob
  await prisma.notification.create({
    data: {
      user_id: bob.id,
      type: 'info',
      title: 'Welcome!',
      message: 'You have been added to ForSure Core project.',
      action_url: '/projects/forsure-core',
    },
  })

  console.log('✅ Notification created')

  console.log('🌳 Prisma seed completed.')
}

main()
  .catch(e => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
