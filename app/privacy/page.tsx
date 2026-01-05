"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicyPage() {
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
            ReadinessAI Privacy Policy
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto prose prose-sm sm:prose-base prose-slate dark:prose-invert">
          <p className="text-muted-foreground mb-8">
            <strong>Effective date:</strong> 1st January 2026<br />
            <strong>Contact:</strong> info@readinessai.io
          </p>

          <h2 className="text-xl sm:text-2xl font-display font-bold mt-8 mb-4">1. Who we are (Controller)</h2>
          <p>
            ReadinessAI is operated by a UK sole trader and is the data controller for personal data processed through the Service.
          </p>
          <p>
            <strong>Email:</strong> info@readinessai.io<br />
            <strong>ICO status:</strong> Applying/registered with the UK Information Commissioner's Office (ICO).<br />
            <strong>ICO application reference:</strong> C1859969.
          </p>

          <h2 className="text-xl sm:text-2xl font-display font-bold mt-8 mb-4">2. What we collect</h2>
          <p>We collect the following categories of personal data:</p>

          <h3 className="text-lg sm:text-xl font-display font-semibold mt-6 mb-3">A. Account and identity data</h3>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Name (if provided)</li>
            <li>Email address</li>
            <li>Password (stored as a secure hash if you use email/password)</li>
            <li>Identifiers/tokens from third-party sign-in providers (for example, Google sign-in if enabled)</li>
          </ul>

          <h3 className="text-lg sm:text-xl font-display font-semibold mt-6 mb-3">B. Profile and preferences</h3>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Selected sector(s) and career(s)</li>
            <li>Selected difficulty level(s) and progress</li>
            <li>Website preferences and settings</li>
          </ul>

          <h3 className="text-lg sm:text-xl font-display font-semibold mt-6 mb-3">C. Knowledge Tests and performance data</h3>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Answers to technical and soft skills tests</li>
            <li>Pass/fail results and progress history</li>
            <li>Feedback shown</li>
            <li>Readiness Score and score breakdowns</li>
          </ul>

          <h3 className="text-lg sm:text-xl font-display font-semibold mt-6 mb-3">D. Peer Benchmarking data</h3>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Your scores and performance metrics used to generate benchmarking comparisons</li>
            <li>Aggregated peer statistics (for example, averages by sector, career, or level). Aggregated statistics do not identify individuals.</li>
          </ul>

          <h3 className="text-lg sm:text-xl font-display font-semibold mt-6 mb-3">E. Goal setting and journaling data</h3>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Goals you create and progress tracking data</li>
            <li>Journal entries and notes you choose to save</li>
          </ul>

          <h3 className="text-lg sm:text-xl font-display font-semibold mt-6 mb-3">F. Technical, usage, and device data</h3>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>IP address and basic device/browser information (such as browser type and version)</li>
            <li>Website logs (timestamps, pages viewed, actions taken)</li>
            <li>Security events and error reports</li>
            <li>Cookies or similar identifiers where used (see Section 11)</li>
          </ul>

          <h3 className="text-lg sm:text-xl font-display font-semibold mt-6 mb-3">G. Communications</h3>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Messages you send to support</li>
            <li>Email preferences and opt-in choices</li>
          </ul>

          <h2 className="text-xl sm:text-2xl font-display font-bold mt-8 mb-4">3. How we use your data</h2>
          <p>We use personal data to:</p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>create and administer your account;</li>
            <li>provide Careers browsing, Knowledge Tests, Readiness Scores, feedback, dashboards, and progress views;</li>
            <li>provide Peer Benchmarking using aggregated statistics;</li>
            <li>enable Goal Setting and Journaling features and store your entries;</li>
            <li>personalise your experience (for example, showing selected careers or progress);</li>
            <li>maintain security, prevent abuse, detect fraud, and troubleshoot;</li>
            <li>improve the Service (including question quality and website performance);</li>
            <li>communicate with you about service updates, security notices, and support requests;</li>
            <li>send marketing emails only where you opt in (unsubscribe anytime).</li>
          </ul>

          <h2 className="text-xl sm:text-2xl font-display font-bold mt-8 mb-4">4. Lawful bases for processing (UK GDPR and GDPR)</h2>
          <p>Where UK GDPR/GDPR applies, we rely on:</p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li><strong>Contract:</strong> to provide the Service you request (account, tests, scoring, benchmarking, goals, journaling).</li>
            <li><strong>Legitimate interests:</strong> to secure, maintain, and improve the Service, prevent fraud/abuse, and understand usage patterns.</li>
            <li><strong>Consent:</strong> for optional marketing and, where applicable, certain cookies or similar technologies.</li>
          </ul>

          <h2 className="text-xl sm:text-2xl font-display font-bold mt-8 mb-4">5. Peer Benchmarking and aggregation</h2>
          <p>
            Peer Benchmarking compares your performance to aggregated peer statistics. We do not display other users' identities or individual results. Benchmarking outputs may change as more users contribute data.
          </p>

          <h2 className="text-xl sm:text-2xl font-display font-bold mt-8 mb-4">6. Journaling and sensitive personal data</h2>
          <p>
            Journaling is optional. Please avoid entering sensitive personal data (for example, health, religious beliefs, sexuality, or precise location). If you choose to include sensitive information, you acknowledge you are choosing to store it so the journaling feature can function.
          </p>

          <h2 className="text-xl sm:text-2xl font-display font-bold mt-8 mb-4">7. Sharing your data</h2>
          <p>We do not sell your personal data. We may share data with:</p>

          <h3 className="text-lg sm:text-xl font-display font-semibold mt-6 mb-3">A. Service providers (processors)</h3>
          <p>
            Trusted vendors that help operate the website and Service (for example, hosting, authentication, analytics, error monitoring, email delivery, and customer support). They process data only on our instructions and to provide services to us.
          </p>

          <h3 className="text-lg sm:text-xl font-display font-semibold mt-6 mb-3">B. Legal and safety</h3>
          <p>
            Where required by law, to enforce our Terms, protect rights and safety, investigate fraud/security incidents, or respond to lawful requests.
          </p>

          <h3 className="text-lg sm:text-xl font-display font-semibold mt-6 mb-3">C. Business transfers</h3>
          <p>
            If ReadinessAI is sold or reorganised, personal data may be transferred as part of that transaction, subject to appropriate safeguards.
          </p>

          <h2 className="text-xl sm:text-2xl font-display font-bold mt-8 mb-4">8. International users and cross-border transfers</h2>
          <p>
            ReadinessAI may be accessed globally. Data may be processed in the UK and other countries where providers operate. Where UK GDPR/GDPR applies and data is transferred internationally, we use appropriate safeguards recognised under applicable law.
          </p>

          <h2 className="text-xl sm:text-2xl font-display font-bold mt-8 mb-4">9. Retention</h2>
          <p>
            We retain personal data as long as necessary to provide the Service and for legitimate business purposes. You may request deletion of your account by contacting info@readinessai.io. Some limited data may be retained for legal, security, fraud-prevention, or backup purposes.
          </p>

          <h2 className="text-xl sm:text-2xl font-display font-bold mt-8 mb-4">10. Your rights</h2>
          <p>
            Depending on your location, you may have rights to access, correct, delete, restrict, object, and port your personal data, and to withdraw consent for marketing.
          </p>
          <p>
            To exercise rights, contact info@readinessai.io. We may need to verify your identity.
          </p>

          <h2 className="text-xl sm:text-2xl font-display font-bold mt-8 mb-4">11. Cookies and similar technologies</h2>
          <p>ReadinessAI may use cookies or similar technologies on the website for:</p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Strictly necessary purposes (for example, maintaining sessions and keeping you signed in)</li>
            <li>Preferences (remembering settings)</li>
            <li>Analytics (understanding usage and improving performance)</li>
            <li>Security (fraud prevention and protecting accounts)</li>
          </ul>
          <p>
            Where required by law, we will provide cookie choices and obtain consent for non-essential cookies. You can also control cookies through your browser settings, but disabling cookies may affect website functionality.
          </p>

          <h2 className="text-xl sm:text-2xl font-display font-bold mt-8 mb-4">12. Automated decision-making</h2>
          <p>
            ReadinessAI generates Readiness Scores and feedback based on your inputs and activity. These outputs are for learning and self-development and are not intended to produce legal or similarly significant effects. Do not use ReadinessAI as the sole basis for employment, admissions, or selection decisions.
          </p>

          <h2 className="text-xl sm:text-2xl font-display font-bold mt-8 mb-4">13. Children</h2>
          <p>
            ReadinessAI is not intended for children under 13. If you believe a child under 13 has provided personal data, contact info@readinessai.io and we will take appropriate steps.
          </p>

          <h2 className="text-xl sm:text-2xl font-display font-bold mt-8 mb-4">14. Changes to this Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. If changes are material, we will take reasonable steps to notify you (for example, a notice on the website or by email). Continued use after the effective date means you accept the updated Policy.
          </p>

          <h2 className="text-xl sm:text-2xl font-display font-bold mt-8 mb-4">15. Contact</h2>
          <p>
            Privacy questions and requests: <a href="mailto:info@readinessai.io" className="text-primary hover:underline">info@readinessai.io</a>
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

