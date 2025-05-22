import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import AnimateOnScroll from "@/components/animate-on-scroll"

export default function TermsPage() {
  return (
    <div className="container py-12 max-w-4xl">
      <div className="space-y-8">
        <div>
          <Button asChild variant="outline" size="sm" className="mb-4">
            <Link href="/" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Link>
          </Button>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: May 21, 2025</p>
        </div>

        <AnimateOnScroll type="fade">
          <div className="prose dark:prose-invert max-w-none">
            <p>
              These Terms of Service ("Terms") govern your access to and use of ForSure's website, products, and
              services (collectively, the "Services"). Please read these Terms carefully, and contact us if you have any
              questions.
            </p>

            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using our Services, you agree to be bound by these Terms and our Privacy Policy. If you do
              not agree to these Terms, you may not access or use the Services.
            </p>

            <h2>2. Changes to Terms</h2>
            <p>
              We may modify the Terms at any time, at our sole discretion. If we do so, we'll let you know either by
              posting the modified Terms on the Site or through other communications. It's important that you review the
              Terms whenever we modify them because if you continue to use the Services after we have posted modified
              Terms on the Site, you are indicating to us that you agree to be bound by the modified Terms.
            </p>

            <h2>3. Using Our Services</h2>
            <p>
              You may use our Services only if you can form a binding contract with ForSure, and only in compliance with
              these Terms and all applicable laws. When you create your ForSure account, you must provide us with
              accurate and complete information.
            </p>

            <h2>4. Your Content</h2>
            <p>
              Our Services allow you to create, upload, post, send, receive, and store content. When you do that, you
              retain whatever ownership rights in that content you had to begin with. But you grant us a license to use
              that content to provide our Services.
            </p>

            <h2>5. Privacy</h2>
            <p>
              ForSure cares about the privacy of its users. Please refer to our{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>{" "}
              for information relating to how we collect, use, and disclose your personal information.
            </p>

            <h2>6. Security</h2>
            <p>
              We care about the security of our users. While we work to protect the security of your content and
              account, ForSure cannot guarantee that unauthorized third parties will not be able to defeat our security
              measures. Please notify us immediately of any compromise or unauthorized use of your account.
            </p>

            <h2>7. Third-Party Links and Services</h2>
            <p>
              Our Services may contain links to third-party websites or services that are not owned or controlled by
              ForSure. ForSure has no control over, and assumes no responsibility for, the content, privacy policies, or
              practices of any third-party websites or services.
            </p>

            <h2>8. Termination</h2>
            <p>
              We may terminate or suspend your access to all or part of our Services, without notice, for any conduct
              that we, in our sole discretion, believe is in violation of any applicable law or is harmful to the
              interests of another user, a third party, or us.
            </p>

            <h2>9. Disclaimer of Warranties</h2>
            <p>
              Our Services are provided "as is" and "as available" without warranty of any kind. Without limiting the
              foregoing, we explicitly disclaim any warranties of merchantability, fitness for a particular purpose,
              quiet enjoyment, or non-infringement, and any warranties arising out of course of dealing or usage of
              trade.
            </p>

            <h2>10. Limitation of Liability</h2>
            <p>
              In no event will ForSure be liable to you or any third party for any direct, indirect, incidental,
              special, consequential, or punitive damages arising out of or relating to your access to or use of, or
              your inability to access or use, the Services or any materials or content on the Services, whether based
              on warranty, contract, tort (including negligence), statute, or any other legal theory.
            </p>

            <h2>11. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the State of California,
              without giving effect to any principles of conflicts of law.
            </p>

            <h2>12. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
              <br />
              Email: legal@forsure-lang.com
              <br />
              Address: 123 Developer Way, San Francisco, CA 94107, United States
            </p>
          </div>
        </AnimateOnScroll>

        <div className="border-t pt-8">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} ForSure. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
