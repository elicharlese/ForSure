'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Github, Twitter, Terminal, Code, BookOpen } from 'lucide-react'
import { useTheme } from 'next-themes'

export default function Footer() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <footer className="w-full border-t border-primary/20 bg-background">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative w-8 h-8">
                <div
                  className={`absolute inset-0 rounded-full blur-lg ${
                    isDark ? 'bg-primary/15' : 'bg-primary/10'
                  } scale-125`}
                />
                <Image
                  src="/fs-logo.png"
                  alt="ForSure Logo"
                  width={32}
                  height={32}
                  className="h-8 w-8"
                  style={{
                    filter: isDark
                      ? 'drop-shadow(0 0 8px rgba(140, 255, 230, 0.25))'
                      : 'drop-shadow(0 0 6px rgba(140, 255, 230, 0.15))',
                  }}
                />
              </div>
              <span
                className={`font-bold text-xl ${isDark ? 'text-primary' : 'text-secondary'}`}
              >
                ForSure
              </span>
            </Link>
            <p className="text-sm text-secondary/80 dark:text-white/80">
              A powerful file structure definition language and CLI tool for
              developers.
            </p>
            <div className="flex gap-4">
              <Link
                href="https://github.com/elicharlese/ForSure"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary/80 dark:text-white/80 hover:text-primary"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href="https://twitter.com/forsure_lang"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary/80 dark:text-white/80 hover:text-primary"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-lg">Products</h3>
            <Link
              href="/cli"
              className="text-sm text-secondary/80 dark:text-white hover:text-primary flex items-center gap-2"
            >
              <Terminal className="h-4 w-4" /> CLI
            </Link>
            <Link
              href="/language"
              className="text-sm text-secondary/80 dark:text-white hover:text-primary flex items-center gap-2"
            >
              <Code className="h-4 w-4" /> Language
            </Link>
            <Link
              href="/app"
              className="text-sm text-secondary/80 dark:text-white hover:text-primary"
            >
              Web Editor
            </Link>
            <Link
              href="/extensions"
              className="text-sm text-secondary/80 dark:text-white hover:text-primary"
            >
              IDE Extensions
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-lg">Resources</h3>
            <Link
              href="/docs"
              className="text-sm text-secondary/80 dark:text-white hover:text-primary flex items-center gap-2"
            >
              <BookOpen className="h-4 w-4" /> Documentation
            </Link>
            <Link
              href="/examples"
              className="text-sm text-secondary/80 dark:text-white hover:text-primary"
            >
              Examples
            </Link>
            <Link
              href="/templates"
              className="text-sm text-secondary/80 dark:text-white hover:text-primary"
            >
              Templates
            </Link>
            <Link
              href="/blog"
              className="text-sm text-secondary/80 dark:text-white hover:text-primary"
            >
              Blog
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-lg">Company</h3>
            <Link
              href="/about"
              className="text-sm text-secondary/80 dark:text-white hover:text-primary"
            >
              About
            </Link>
            <Link
              href="/careers"
              className="text-sm text-secondary/80 dark:text-white hover:text-primary"
            >
              Careers
            </Link>
            <Link
              href="/contact"
              className="text-sm text-secondary/80 dark:text-white hover:text-primary"
            >
              Contact
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-secondary/80 dark:text-white hover:text-primary"
            >
              Privacy Policy
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-primary/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-secondary/60 dark:text-white/60">
            © {new Date().getFullYear()} ForSure. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/terms"
              className="text-sm text-secondary/60 dark:text-white/60 hover:text-primary"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-secondary/60 dark:text-white/60 hover:text-primary"
            >
              Privacy
            </Link>
            <Link
              href="/cookies"
              className="text-sm text-secondary/60 dark:text-white/60 hover:text-primary"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
