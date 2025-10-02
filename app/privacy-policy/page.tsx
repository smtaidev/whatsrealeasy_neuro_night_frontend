// app/terms/page.tsx
import { env } from "@/env";
import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions - Aigents",
  description:
    "Read the Terms & Conditions for Aigents, including account usage, batch processing, OAuth login, and legal disclaimers.",
};

export default function TermsPage() {
  return (
    <main className="max-w-4xl mx-auto py-16 px-6">
      <div className="bg-white text-gray-800 rounded-2xl shadow-lg p-8 md:p-12 leading-relaxed">
        <h1 className="text-3xl font-bold mb-4">Terms & Conditions</h1>
        <p className="text-sm text-gray-500 mb-10">Last updated: October 2025</p>

        <section className="space-y-10">
          {/* 1. Introduction */}
          <div>
            <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
            <p>
              Welcome to <strong>Aigents</strong>. By using our services—such as
              batch number processing, OAuth login/signup, and related features— 
              you agree to these Terms. If you do not agree, please stop using 
              the service immediately.
            </p>
          </div>

          {/* 2. Eligibility */}
          <div>
            <h2 className="text-xl font-semibold mb-2">2. Eligibility</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>You must be at least 18 years old or have parental consent.</li>
              <li>You are solely responsible for compliance with applicable laws.</li>
            </ul>
          </div>

          {/* 3. Accounts & Security */}
          <div>
            <h2 className="text-xl font-semibold mb-2">3. Accounts & Security</h2>
            <p>
              You may register via OAuth (Google, GitHub, etc.) or other supported
              methods. You are responsible for safeguarding your account
              credentials and for all activity on your account. We are not liable
              for unauthorized access caused by your failure to protect credentials.
            </p>
          </div>

          {/* 4. Batch Processing */}
          <div>
            <h2 className="text-xl font-semibold mb-2">4. Batch Processing of Numbers</h2>
            <p>
              Our service may allow batch submission of multiple numbers. You
              confirm you have legal rights to process these numbers. Misuse—
              including spam, fraud, or unauthorized data sharing—is strictly
              prohibited and may result in suspension or termination.
            </p>
          </div>

          {/* 5. Acceptable Use */}
          <div>
            <h2 className="text-xl font-semibold mb-2">5. Acceptable Use</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>No unlawful, fraudulent, or abusive activities.</li>
              <li>No interference with or disruption of our systems.</li>
              <li>No scraping, reverse engineering, or unauthorized API usage.</li>
            </ul>
          </div>

          {/* 6. Data & Privacy */}
          <div>
            <h2 className="text-xl font-semibold mb-2">6. Data & Privacy</h2>
            <p>
              We collect limited data necessary to provide the service. OAuth
              sign-in authorizes us to access basic profile details from your
              provider. For more information, please review our{" "}
              <Link
                href="/privacy"
                className="text-blue-600 underline hover:text-blue-800"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>

          {/* 7. Service Availability */}
          <div>
            <h2 className="text-xl font-semibold mb-2">7. Service Availability</h2>
            <p>
              While we aim for reliable service, we do not guarantee uninterrupted
              availability. Features (including batch processing and login
              methods) may change or be discontinued without notice.
            </p>
          </div>

          {/* 8. Intellectual Property */}
          <div>
            <h2 className="text-xl font-semibold mb-2">8. Intellectual Property</h2>
            <p>
              Aigents, including its software, branding, and content, is our
              property. You may not copy, reproduce, or distribute our materials
              without written permission.
            </p>
          </div>

          {/* 9. Limitation of Liability */}
          <div>
            <h2 className="text-xl font-semibold mb-2">9. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Aigents is not responsible
              for any indirect, incidental, or consequential damages resulting
              from your use of the service. The platform is provided{" "}
              <em>"as is"</em> and <em>"as available"</em>.
            </p>
          </div>

          {/* 10. Termination */}
          <div>
            <h2 className="text-xl font-semibold mb-2">10. Termination</h2>
            <p>
              We may suspend or terminate your account if you violate these Terms.
              Upon termination, your right to use the service ends immediately.
            </p>
          </div>

          {/* 11. Governing Law */}
          <div>
            <h2 className="text-xl font-semibold mb-2">11. Governing Law</h2>
            <p>
              These Terms are governed by the laws of{" "}
              <span className="italic">[Insert Jurisdiction]</span>. Any disputes
              will be resolved exclusively in the courts of{" "}
              <span className="italic">[Insert Jurisdiction]</span>.
            </p>
          </div>

          {/* 12. Changes to Terms */}
          <div>
            <h2 className="text-xl font-semibold mb-2">12. Changes to Terms</h2>
            <p>
              We may update these Terms from time to time. Continued use after
              updates indicates acceptance of the revised Terms.
            </p>
          </div>

          {/* 13. Contact */}
          <div>
            <h2 className="text-xl font-semibold mb-2">13. Contact</h2>
          <p>
              For questions about these Terms, please contact us at:{" "}
              <Link
                href={`mailto:${env.NEXT_PUBLIC_OUTBOUND_EMAIL}`}
                className="text-blue-600 underline hover:text-blue-800"
              >
                {env.NEXT_PUBLIC_OUTBOUND_EMAIL}
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
