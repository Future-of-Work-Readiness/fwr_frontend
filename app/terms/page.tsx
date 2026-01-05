"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-navy-dark text-white py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/">
            <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold">
            ReadinessAI Terms of Service
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto prose prose-sm sm:prose-base prose-slate dark:prose-invert">
          <p className="text-muted-foreground mb-6">
            <strong>Effective date:</strong> 1st January 2026<br />
            <strong>Contact:</strong> info@readinessai.io<br />
            <strong>Operated by:</strong> ReadinessAI, a UK sole trader ("we", "us", "our").
          </p>

          <p className="mb-8">
            By creating an account, accessing, or using the ReadinessAI website and services (the "Service"), you agree to these Terms of Service (the "Terms"). If you do not agree, do not use the Service.
          </p>

          <h2 className="text-xl sm:text-2xl font-display font-bold mt-8 mb-4">1. Eligibility</h2>
          <p>
            You must be at least 13 years old to use ReadinessAI. If you are under the age where parental consent is required in your country, you confirm you have permission from a parent or legal guardian.
          </p>

          <h2 className="text-xl sm:text-2xl font-display font-bold mt-8 mb-4">2. The Service</h2>
          <p>ReadinessAI is a web-based learning and development platform that includes:</p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Careers and sectors browsing and selection</li>
            <li>Knowledge Tests (technical and soft skills)</li>
            <li>Readiness Score and performance summaries</li>
            <li>Peer Benchmarking (your results compared to aggregated peer results)</li>
            <li>Goal Setting and progress tracking</li>
            <li>Journaling and personal notes</li>
          </ul>
          <p>
            The Service is for educational and self-development purposes. It is not a recruitment service and does not provide professional career, legal, medical, or financial advice. We do not guarantee any outcome, including employment, promotion, admission, or certification.
          </p>

          <h2 className="text-xl sm:text-2xl font-display font-bold mt-8 mb-4">3. Accounts and security</h2>
          <p>
            You may create an account using email and password or sign in via third-party authentication (such as Google sign-in if enabled). You are responsible for keeping your login details secure and for all activity on your account. You agree to provide accurate information and keep it updated.
          </p>

          <h2 className="text-xl sm:text-2xl font-display font-bold mt-8 mb-4">4. Acceptable use</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>use the Service unlawfully or to harm others;</li>
            <li>attempt to bypass security or access data you are not authorised to access;</li>
            <li>reverse engineer, decompile, scrape, or attempt to copy the Service or its content except where permitted by law;</li>
            <li>upload malware, abuse rate limits, or interfere with the Service's performance;</li>
            <li>use scores, Peer Benchmarking, or outputs to evaluate, rank, or make decisions about other individuals (for example, employment screening);</li>
            <li>submit content that infringes intellectual property, privacy, or other rights.</li>
          </ul>
          <p>We may suspend or terminate access if you breach these Terms.</p>

          <h2 className="text-xl sm:text-2xl font-display font-bold mt-8 mb-4">5. Your content (Goals and Journaling)</h2>
          <p>
            You may submit content such as goals, journal entries, and notes ("User Content"). You retain ownership of your User Content. You grant us a limited, non-exclusive licence to host, store, process, and display your User Content solely to operate the Service and provide features you request (such as saving entries and showing your history).
          </p>
          <p>
            You are responsible for your User Content. Do not submit illegal content or content that violates others' rights.
          </p>

          <h2 className="text-xl sm:text-2xl font-display font-bold mt-8 mb-4">6. Peer Benchmarking</h2>
          <p>
            Peer Benchmarking compares your performance to aggregated statistics from other users (for example, average scores by sector, career, or level). We do not display other users' identities or individual results.
          </p>
          <p>
            Benchmarking depends on available data and may change over time as more users participate.
          </p>

          <h2 className="text-xl sm:text-2xl font-display font-bold mt-8 mb-4">7. Intellectual property</h2>
          <p>
            The Service, including software, design, databases, question banks, scoring logic, text, and trademarks, is owned by ReadinessAI (or its licensors). You may not copy, reproduce, sell, sublicense, or commercially exploit any part of the Service without written permission, except where permitted by law.
          </p>

          <h2 className="text-xl sm:text-2xl font-display font-bold mt-8 mb-4">8. Service availability and changes</h2>
          <p>
            We may update, change, suspend, or discontinue any part of the Service, including features, scoring logic, and question content. We aim to keep the Service available but do not guarantee uninterrupted access.
          </p>

          <h2 className="text-xl sm:text-2xl font-display font-bold mt-8 mb-4">9. Termination and account deletion</h2>
          <p>
            You may stop using ReadinessAI at any time. You may request account deletion by contacting info@readinessai.io. We may retain limited information where necessary for legal, security, fraud-prevention, or backup purposes, as described in the Privacy Policy.
          </p>

          <h2 className="text-xl sm:text-2xl font-display font-bold mt-8 mb-4">10. Disclaimers</h2>
          <p>
            The Service is provided "as is" and "as available". To the extent permitted by law, we disclaim all warranties, including fitness for a particular purpose and non-infringement.
          </p>

          <h2 className="text-xl sm:text-2xl font-display font-bold mt-8 mb-4">11. Limitation of liability</h2>
          <p>
            To the extent permitted by law, we will not be liable for indirect, incidental, special, consequential, or punitive damages, or for loss of profits, revenue, data, or goodwill arising from or related to your use of the Service. Nothing in these Terms limits liability that cannot be limited by law.
          </p>

          <h2 className="text-xl sm:text-2xl font-display font-bold mt-8 mb-4">12. Governing law</h2>
          <p>
            These Terms are governed by the laws of England and Wales, and courts in England and Wales will have jurisdiction, except where mandatory consumer protections apply in your country.
          </p>

          <h2 className="text-xl sm:text-2xl font-display font-bold mt-8 mb-4">13. Changes to these Terms</h2>
          <p>
            We may update these Terms from time to time. If changes are material, we will take reasonable steps to notify you (for example, a notice on the website or by email). Continued use after the effective date means you accept the updated Terms.
          </p>

          <h2 className="text-xl sm:text-2xl font-display font-bold mt-8 mb-4">14. Contact</h2>
          <p>
            Questions about these Terms: <a href="mailto:info@readinessai.io" className="text-primary hover:underline">info@readinessai.io</a>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} ReadinessAI. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

