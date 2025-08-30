import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight, Calendar, User, Clock, Tag } from 'lucide-react'
import AnimateOnScroll from '@/components/animate-on-scroll'

const blogPosts = [
  {
    id: 'getting-started-with-forsure',
    title: "Getting Started with ForSure: A Beginner's Guide",
    excerpt:
      'Learn how to use ForSure to define, document, and generate project structures for your applications. This guide covers installation, basic syntax, and your first ForSure file.',
    date: 'May 21, 2025',
    author: 'Jane Developer',
    readTime: '5 min read',
    tags: ['Beginner', 'Tutorial'],
    image: '/blog/getting-started.png',
  },
  {
    id: 'best-practices-for-project-structure',
    title: 'Best Practices for Project Structure in Modern Web Applications',
    excerpt:
      "Discover the best practices for organizing your web application's file structure. Learn how ForSure can help you implement these practices consistently across your projects.",
    date: 'May 15, 2025',
    author: 'John Coder',
    readTime: '8 min read',
    tags: ['Best Practices', 'Web Development'],
    image: '/blog/best-practices.png',
  },
  {
    id: 'forsure-vs-alternatives',
    title:
      'ForSure vs. Alternatives: Why Choose ForSure for Your Project Structure',
    excerpt:
      'Compare ForSure with other project structure tools and approaches. Learn about the unique features and benefits that make ForSure the best choice for your projects.',
    date: 'May 10, 2025',
    author: 'Alex Engineer',
    readTime: '6 min read',
    tags: ['Comparison', 'Tools'],
    image: '/blog/comparison.png',
  },
  {
    id: 'using-forsure-in-team-environments',
    title: 'Using ForSure in Team Environments: Collaboration and Consistency',
    excerpt:
      "Learn how ForSure can improve collaboration and maintain consistency in team environments. Discover strategies for integrating ForSure into your team's workflow.",
    date: 'May 5, 2025',
    author: 'Sarah Manager',
    readTime: '7 min read',
    tags: ['Teams', 'Collaboration'],
    image: '/blog/team-environments.png',
  },
  {
    id: 'advanced-forsure-techniques',
    title:
      'Advanced ForSure Techniques: Templates, Imports, and Custom Attributes',
    excerpt:
      'Take your ForSure skills to the next level with advanced techniques. Learn how to use templates, imports, and custom attributes to create more powerful and flexible project structures.',
    date: 'April 28, 2025',
    author: 'Mike Expert',
    readTime: '10 min read',
    tags: ['Advanced', 'Tutorial'],
    image: '/blog/advanced-techniques.png',
  },
  {
    id: 'forsure-cli-deep-dive',
    title: 'ForSure CLI Deep Dive: Commands, Options, and Workflows',
    excerpt:
      'Explore the ForSure CLI in depth. Learn about all the commands, options, and workflows that can help you get the most out of ForSure in your development process.',
    date: 'April 20, 2025',
    author: 'Chris Terminal',
    readTime: '9 min read',
    tags: ['CLI', 'Tools'],
    image: '/blog/cli-deep-dive.png',
  },
]

export default function BlogPage() {
  return (
    <div className="container py-12 max-w-6xl">
      <div className="space-y-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            ForSure Blog
          </h1>
          <p className="text-xl text-muted-foreground">
            Insights, tutorials, and best practices for project structure and
            organization.
          </p>
        </div>

        {/* Featured Post */}
        <AnimateOnScroll type="fade">
          <div className="relative rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 to-secondary/60 dark:from-secondary-dark/90 dark:to-secondary-dark/60 z-10" />
            <Image
              src="/blog/featured-post.png"
              alt="Featured blog post"
              width={1200}
              height={600}
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute inset-0 z-20 flex flex-col justify-end p-8">
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-white/80">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" /> May 25, 2025
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" /> Jane Developer
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" /> 12 min read
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-white">
                  The Future of Project Structure: ForSure 2.0 Preview
                </h2>
                <p className="text-white/90 max-w-3xl">
                  Get an exclusive preview of ForSure 2.0, the next major
                  version of our project structure language and CLI. Discover
                  the new features, improvements, and how they'll transform your
                  development workflow.
                </p>
                <Button
                  asChild
                  className="bg-primary text-secondary-dark hover:bg-primary/90"
                >
                  <Link
                    href="/blog/future-of-project-structure"
                    className="flex items-center"
                  >
                    Read Article <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </AnimateOnScroll>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <AnimateOnScroll key={post.id} type="slideUp" delay={index * 0.1}>
              <div className="bg-white dark:bg-secondary-dark/30 rounded-lg overflow-hidden border border-primary/10 h-full flex flex-col">
                <div className="relative h-48">
                  <Image
                    src={post.image || '/placeholder.svg'}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center"
                      >
                        <Tag className="h-3 w-3 mr-1" /> {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-xl font-bold mb-2 hover:text-primary transition-colors">
                    <Link href={`/blog/${post.id}`}>{post.title}</Link>
                  </h3>
                  <p className="text-muted-foreground mb-4 flex-1">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t border-primary/10">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" /> {post.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" /> {post.readTime}
                    </div>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        {/* Newsletter Signup */}
        <AnimateOnScroll type="slideUp">
          <div className="bg-muted dark:bg-muted/10 p-8 rounded-lg">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <h2 className="text-2xl font-bold">
                Subscribe to Our Newsletter
              </h2>
              <p className="text-muted-foreground">
                Stay up to date with the latest ForSure news, tutorials, and
                best practices. We'll send you a monthly digest of our best
                content.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <Button className="whitespace-nowrap">Subscribe</Button>
              </div>
              <p className="text-xs text-muted-foreground">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </AnimateOnScroll>

        {/* More Articles Link */}
        <div className="text-center">
          <Button asChild variant="outline">
            <Link href="/blog/archive" className="flex items-center">
              View All Articles <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
