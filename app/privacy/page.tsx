import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import AnimateOnScroll from '@/components/animate-on-scroll'

export default function PrivacyPage() {
  return (
    <div className="container py-12 max-w-4xl">
      <div className="space-y-8">
        <div>
          <Button asChild variant="outline" size="sm" className="mb-4">
            <Link href="/" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Link>
          </Button>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground">Last updated: May 21, 2025</p>
        </div>

        <AnimateOnScroll type="fade">
          <div className="prose dark:prose-invert max-w-none">
            <p>
              This Privacy Policy describes how ForSure ("we", "us", or "our")
              collects, uses, and discloses your information when you use our
              website, products, and services (collectively, the "Services").
            </p>

            <h2>Information We Collect</h2>
            <p>
              We collect several types of information from and about users of
              our Services, including:
            </p>
            <ul>
              <li>
                <strong>Personal Information:</strong> This includes information
                that can be used to identify you, such as your name, email
                address, and contact information.
              </li>
              <li>
                <strong>Usage Data:</strong> We collect information about how
                you interact with our Services, including the pages you visit,
                the time you spend on each page, and the actions you take.
              </li>
              <li>
                <strong>Device Information:</strong> We collect information
                about the device you use to access our Services, including the
                hardware model, operating system, and browser type.
              </li>
            </ul>

            <h2>How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, maintain, and improve our Services</li>
              <li>Respond to your requests and inquiries</li>
              <li>
                Send you technical notices, updates, and administrative messages
              </li>
              <li>
                Monitor and analyze trends, usage, and activities in connection
                with our Services
              </li>
              <li>Detect, prevent, and address technical issues</li>
              <li>
                Protect against harmful, unauthorized, or illegal activity
              </li>
            </ul>

            <h2>How We Share Your Information</h2>
            <p>We may share your information in the following circumstances:</p>
            <ul>
              <li>
                <strong>With Service Providers:</strong> We may share your
                information with third-party vendors, consultants, and other
                service providers who need access to such information to carry
                out work on our behalf.
              </li>
              <li>
                <strong>For Legal Reasons:</strong> We may disclose your
                information if we believe it is necessary to comply with a legal
                obligation, protect our rights or the rights of others, or
                investigate fraud or security issues.
              </li>
              <li>
                <strong>With Your Consent:</strong> We may share your
                information with third parties when you have given us your
                consent to do so.
              </li>
            </ul>

            <h2>Your Rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding
              your personal information, including:
            </p>
            <ul>
              <li>
                The right to access the personal information we hold about you
              </li>
              <li>
                The right to request that we correct or update your personal
                information
              </li>
              <li>
                The right to request that we delete your personal information
              </li>
              <li>
                The right to object to the processing of your personal
                information
              </li>
              <li>The right to data portability</li>
            </ul>

            <h2>Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to
              protect your personal information from unauthorized access,
              disclosure, alteration, and destruction. However, no method of
              transmission over the Internet or method of electronic storage is
              100% secure, and we cannot guarantee absolute security.
            </p>

            <h2>Children's Privacy</h2>
            <p>
              Our Services are not intended for children under the age of 13,
              and we do not knowingly collect personal information from children
              under 13. If we learn that we have collected personal information
              from a child under 13, we will take steps to delete that
              information as quickly as possible.
            </p>

            <h2>Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. If we make
              material changes, we will notify you by email or by posting a
              notice on our website prior to the change becoming effective. We
              encourage you to review this Privacy Policy periodically for the
              latest information on our privacy practices.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions or concerns about this Privacy Policy or
              our privacy practices, please contact us at:
            </p>
            <p>
              Email: privacy@forsure-lang.com
              <br />
              Address: 123 Developer Way, San Francisco, CA 94107, United States
            </p>
          </div>
        </AnimateOnScroll>

        <div className="border-t pt-8">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ForSure. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
