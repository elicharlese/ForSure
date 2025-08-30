import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Mail } from 'lucide-react'
import AnimateOnScroll from '@/components/animate-on-scroll'

export default function CareersPage() {
  return (
    <div className="container py-12 max-w-4xl">
      <div className="space-y-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Careers at ForSure
          </h1>
          <p className="text-xl text-muted-foreground">
            Join our team and help shape the future of project structure
            documentation.
          </p>
        </div>

        <AnimateOnScroll type="slideUp">
          <div className="bg-muted dark:bg-muted/10 p-8 rounded-lg space-y-4">
            <h2 className="text-2xl font-bold">Why Work With Us?</h2>
            <p className="text-muted-foreground">
              At ForSure, we're building tools that help developers work more
              efficiently. We're a small, passionate team focused on creating
              the best possible experience for our users.
            </p>
            <p className="text-muted-foreground">
              We offer competitive salaries, flexible working hours,
              remote-first culture, and the opportunity to work on open-source
              software that impacts thousands of developers worldwide.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="bg-white dark:bg-secondary-dark/30 p-4 rounded-lg">
                <h3 className="font-bold mb-2">Remote-First</h3>
                <p className="text-sm text-secondary/80 dark:text-primary-light/70">
                  Work from anywhere in the world. We believe in hiring the best
                  talent, regardless of location.
                </p>
              </div>
              <div className="bg-white dark:bg-secondary-dark/30 p-4 rounded-lg">
                <h3 className="font-bold mb-2">Flexible Hours</h3>
                <p className="text-sm text-secondary/80 dark:text-primary-light/70">
                  We trust you to manage your time. Work when you're most
                  productive.
                </p>
              </div>
              <div className="bg-white dark:bg-secondary-dark/30 p-4 rounded-lg">
                <h3 className="font-bold mb-2">Open Source</h3>
                <p className="text-sm text-secondary/80 dark:text-primary-light/70">
                  Contribute to open-source projects and build your public
                  portfolio while getting paid.
                </p>
              </div>
            </div>
          </div>
        </AnimateOnScroll>

        <div className="space-y-8">
          <h2 className="text-2xl font-bold">Open Positions</h2>

          <AnimateOnScroll type="slideUp" delay={0.1}>
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-secondary/10 dark:bg-primary/10 p-4 border-b border-primary/10">
                <h3 className="text-xl font-bold">Senior Frontend Developer</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    Remote
                  </span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    Full-time
                  </span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    React
                  </span>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-secondary/80 dark:text-primary-light/70">
                  We're looking for a senior frontend developer to help us build
                  the next generation of our web application. You'll be
                  responsible for designing and implementing new features,
                  improving performance, and ensuring a great user experience.
                </p>
                <h4 className="font-bold">Requirements:</h4>
                <ul className="list-disc pl-5 space-y-1 text-secondary/80 dark:text-primary-light/70">
                  <li>5+ years of experience with React</li>
                  <li>Strong TypeScript skills</li>
                  <li>Experience with Next.js</li>
                  <li>Understanding of modern CSS (Tailwind preferred)</li>
                  <li>
                    Experience with state management (Redux, Zustand, etc.)
                  </li>
                </ul>
                <div className="pt-4">
                  <Button asChild>
                    <Link href="/contact" className="flex items-center">
                      Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll type="slideUp" delay={0.2}>
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-secondary/10 dark:bg-primary/10 p-4 border-b border-primary/10">
                <h3 className="text-xl font-bold">Backend Developer</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    Remote
                  </span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    Full-time
                  </span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    Node.js
                  </span>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-secondary/80 dark:text-primary-light/70">
                  We're looking for a backend developer to help us build and
                  maintain our API and CLI tools. You'll be working on improving
                  performance, adding new features, and ensuring reliability.
                </p>
                <h4 className="font-bold">Requirements:</h4>
                <ul className="list-disc pl-5 space-y-1 text-secondary/80 dark:text-primary-light/70">
                  <li>3+ years of experience with Node.js</li>
                  <li>Experience with TypeScript</li>
                  <li>Understanding of RESTful APIs</li>
                  <li>Experience with databases (PostgreSQL, MongoDB)</li>
                  <li>Knowledge of CLI tool development</li>
                </ul>
                <div className="pt-4">
                  <Button asChild>
                    <Link href="/contact" className="flex items-center">
                      Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll type="slideUp" delay={0.3}>
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-secondary/10 dark:bg-primary/10 p-4 border-b border-primary/10">
                <h3 className="text-xl font-bold">Developer Advocate</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    Remote
                  </span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    Full-time
                  </span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    Community
                  </span>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-secondary/80 dark:text-primary-light/70">
                  We're looking for a developer advocate to help us grow our
                  community and improve our documentation. You'll be creating
                  tutorials, speaking at conferences, and engaging with our
                  users.
                </p>
                <h4 className="font-bold">Requirements:</h4>
                <ul className="list-disc pl-5 space-y-1 text-secondary/80 dark:text-primary-light/70">
                  <li>Experience as a software developer</li>
                  <li>Strong communication skills</li>
                  <li>Experience with technical writing</li>
                  <li>
                    Public speaking experience (conferences, meetups, etc.)
                  </li>
                  <li>Active presence in developer communities</li>
                </ul>
                <div className="pt-4">
                  <Button asChild>
                    <Link href="/contact" className="flex items-center">
                      Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </div>

        <AnimateOnScroll type="fade">
          <div className="bg-white dark:bg-secondary-dark/30 rounded-lg p-6 shadow-sm border border-primary/10 text-center space-y-4">
            <h2 className="text-2xl font-bold">
              Don't See a Position That Fits?
            </h2>
            <p className="text-secondary/80 dark:text-primary-light/70 max-w-2xl mx-auto">
              We're always looking for talented individuals to join our team. If
              you're passionate about what we do and think you could contribute,
              we'd love to hear from you!
            </p>
            <Button asChild className="mt-2">
              <Link href="/contact" className="flex items-center">
                <Mail className="mr-2 h-4 w-4" /> Send Us Your Resume
              </Link>
            </Button>
          </div>
        </AnimateOnScroll>
      </div>
    </div>
  )
}
