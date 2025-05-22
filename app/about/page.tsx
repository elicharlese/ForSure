import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Github } from "lucide-react"
import AnimateOnScroll from "@/components/animate-on-scroll"

export default function AboutPage() {
  return (
    <div className="container py-12 max-w-4xl">
      <div className="space-y-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">About ForSure</h1>
          <p className="text-xl text-muted-foreground">
            Defining the future of project structure documentation and generation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <AnimateOnScroll type="slideRight">
            <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
              <Image src="/abstract-teal-blue-pattern.png" alt="ForSure Team" fill className="object-cover" />
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll type="slideLeft">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Our Mission</h2>
              <p className="text-muted-foreground">
                At ForSure, we're on a mission to simplify project structure definition and documentation. We believe
                that well-organized and well-documented projects lead to better collaboration, faster onboarding, and
                fewer errors.
              </p>
              <p className="text-muted-foreground">
                Our goal is to provide developers with tools that make it easy to define, document, and generate project
                structures across their entire tech stack.
              </p>
            </div>
          </AnimateOnScroll>
        </div>

        <AnimateOnScroll type="slideUp">
          <div className="space-y-4 bg-muted dark:bg-muted/10 p-8 rounded-lg">
            <h2 className="text-2xl font-bold">Our Story</h2>
            <p className="text-muted-foreground">
              ForSure was born out of frustration with the lack of standardized tools for defining and documenting
              project structures. As developers, we found ourselves repeatedly creating the same directory structures
              and explaining them to new team members.
            </p>
            <p className="text-muted-foreground">
              We created ForSure to solve this problem once and for all. By providing a simple language and powerful CLI
              tool, we've made it easy for developers to define, document, and generate project structures.
            </p>
            <p className="text-muted-foreground">
              Since our launch, we've helped thousands of developers streamline their project setup process and improve
              their documentation.
            </p>
          </div>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <AnimateOnScroll type="slideUp" delay={0.1}>
            <div className="bg-white dark:bg-secondary-dark/30 rounded-lg p-6 shadow-sm border border-primary/10">
              <h3 className="text-xl font-bold mb-2">Open Source</h3>
              <p className="text-secondary/80 dark:text-primary-light/70 mb-4">
                ForSure is proudly open source. We believe in the power of community-driven development and welcome
                contributions from developers around the world.
              </p>
              <Button asChild variant="outline" size="sm">
                <Link
                  href="https://github.com/elicharlese/ForSure"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <Github className="mr-2 h-4 w-4" /> View on GitHub
                </Link>
              </Button>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll type="slideUp" delay={0.2}>
            <div className="bg-white dark:bg-secondary-dark/30 rounded-lg p-6 shadow-sm border border-primary/10">
              <h3 className="text-xl font-bold mb-2">Our Values</h3>
              <ul className="text-secondary/80 dark:text-primary-light/70 space-y-2 list-disc pl-5">
                <li>Simplicity in design and implementation</li>
                <li>Documentation as a first-class citizen</li>
                <li>Community-driven development</li>
                <li>Cross-platform compatibility</li>
                <li>Developer experience above all</li>
              </ul>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll type="slideUp" delay={0.3}>
            <div className="bg-white dark:bg-secondary-dark/30 rounded-lg p-6 shadow-sm border border-primary/10">
              <h3 className="text-xl font-bold mb-2">Join Us</h3>
              <p className="text-secondary/80 dark:text-primary-light/70 mb-4">
                We're always looking for passionate developers to join our team. If you're interested in working with
                us, check out our careers page.
              </p>
              <Button asChild size="sm">
                <Link href="/careers" className="flex items-center">
                  View Careers <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </AnimateOnScroll>
        </div>

        <AnimateOnScroll type="fade">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Get in Touch</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Have questions about ForSure? Want to learn more about our products or services? We'd love to hear from
              you!
            </p>
            <Button asChild className="mt-2">
              <Link href="/contact" className="flex items-center">
                Contact Us <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </AnimateOnScroll>
      </div>
    </div>
  )
}
