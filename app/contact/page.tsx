'use client'

import type React from 'react'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Mail, MapPin, Phone, Send, Check } from 'lucide-react'
import AnimateOnScroll from '@/components/animate-on-scroll'

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  return (
    <div className="container py-12 max-w-4xl">
      <div className="space-y-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Contact Us</h1>
          <p className="text-xl text-muted-foreground">
            Get in touch with our team. We'd love to hear from you!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <AnimateOnScroll type="slideRight">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Get in Touch</h2>
                <p className="text-muted-foreground">
                  Have questions about ForSure? Want to learn more about our
                  products or services? Fill out the form and we'll get back to
                  you as soon as possible.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-full text-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold">Email</h3>
                    <p className="text-muted-foreground">
                      info@forsure-lang.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-full text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold">Address</h3>
                    <p className="text-muted-foreground">
                      123 Developer Way
                      <br />
                      San Francisco, CA 94107
                      <br />
                      United States
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-full text-primary">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold">Phone</h3>
                    <p className="text-muted-foreground">+1 (555) 123-4567</p>
                  </div>
                </div>
              </div>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll type="slideLeft">
            <div className="bg-white dark:bg-secondary-dark/30 rounded-lg p-6 shadow-sm border border-primary/10">
              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center h-full py-12 space-y-4">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                    <Check className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold">Message Sent!</h3>
                  <p className="text-center text-muted-foreground">
                    Thank you for contacting us. We'll get back to you as soon
                    as possible.
                  </p>
                  <Button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-4"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Name
                    </label>
                    <Input id="name" placeholder="Your name" required />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Your email"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      placeholder="Subject of your message"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Your message"
                      rows={5}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Send className="mr-2 h-4 w-4" /> Send Message
                      </span>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </AnimateOnScroll>
        </div>

        <AnimateOnScroll type="slideUp">
          <div className="bg-muted dark:bg-muted/10 p-8 rounded-lg space-y-4">
            <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="space-y-2">
                <h3 className="font-bold">Is ForSure open source?</h3>
                <p className="text-muted-foreground">
                  Yes, ForSure is completely open source. You can find the
                  source code on our GitHub repository.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-bold">Do you offer enterprise support?</h3>
                <p className="text-muted-foreground">
                  Yes, we offer enterprise support plans for organizations that
                  need dedicated support and custom features.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-bold">How can I contribute to ForSure?</h3>
                <p className="text-muted-foreground">
                  We welcome contributions! Check out our GitHub repository for
                  contribution guidelines and open issues.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-bold">Is ForSure free to use?</h3>
                <p className="text-muted-foreground">
                  Yes, ForSure is free and open source. You can use it for
                  personal and commercial projects without any restrictions.
                </p>
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </div>
  )
}
