import type { Metadata } from "next";

const SITE_URL = "https://mtiskari.ge";
const COMPANY_EMAIL = "metreveliteona@yahoo.com";
const COMPANY_PHONE = "+995 551 09 38 09";
const COMPANY_ADDRESS = "სოფელი უწერა, რაჭა, საქართველო (Village Utsera, Racha, Georgia)";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Mtiskari collects, uses, and protects your personal information.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/privacy`,
    title: "Privacy Policy • Mtiskari",
    description: "How Mtiskari collects, uses, and protects your personal information.",
  },
};

const SECTIONS: { title: string; body: React.ReactNode }[] = [
  {
    title: "1. Who we are",
    body: (
      <p>
        Mtiskari (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates a family cottage rental located in{" "}
        {COMPANY_ADDRESS}. This Privacy Policy explains how we collect, use, and safeguard
        information when you visit our website or make a booking.
      </p>
    ),
  },
  {
    title: "2. Information we collect",
    body: (
      <>
        <p>When you make a booking or contact us, we collect:</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Your name, email address, and phone number</li>
          <li>Booking details: check-in/check-out dates, number of guests, selected cottage</li>
          <li>Any message you send us through the contact form</li>
          <li>Payment status related to your booking (we do not store full card details)</li>
        </ul>
      </>
    ),
  },
  {
    title: "3. How we use your information",
    body: (
      <>
        <p>We use the information you provide to:</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Process and confirm your booking</li>
          <li>Send booking confirmation, cancellation, and payment-related emails</li>
          <li>Respond to inquiries sent via our contact form</li>
          <li>Improve our services and website</li>
        </ul>
        <p className="mt-2">We do not sell or rent your personal information to third parties.</p>
      </>
    ),
  },
  {
    title: "4. How we share your information",
    body: (
      <p>
        We only share booking-relevant information with our email service provider (used solely
        to deliver booking confirmations and notifications) and, where applicable, with payment
        processors necessary to complete your transaction. We do not share your data with third
        parties for marketing purposes.
      </p>
    ),
  },
  {
    title: "5. Data retention",
    body: (
      <p>
        We retain booking and contact information for as long as necessary to fulfill your
        booking, respond to your inquiry, and comply with legal or accounting obligations. You
        may request deletion of your data at any time by contacting us (see Section 8).
      </p>
    ),
  },
  {
    title: "6. Cookies",
    body: (
      <p>
        Our website may use essential cookies required for core functionality (such as remembering
        your selected language). We do not use third-party advertising or tracking cookies.
      </p>
    ),
  },
  {
    title: "7. Your rights",
    body: (
      <p>
        You have the right to request access to, correction of, or deletion of your personal
        data held by us. To exercise these rights, contact us using the details below.
      </p>
    ),
  },
  {
    title: "8. Contact us",
    body: (
      <p>
        If you have any questions about this Privacy Policy or how your data is handled, please
        contact us at{" "}
        <a href={`mailto:${COMPANY_EMAIL}`} className="text-green-700 underline">
          {COMPANY_EMAIL}
        </a>{" "}
        or {COMPANY_PHONE}.
      </p>
    ),
  },
  {
    title: "9. Changes to this policy",
    body: (
      <p>
        We may update this Privacy Policy from time to time. Any changes will be posted on this
        page with an updated effective date.
      </p>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <section className="w-full min-h-screen mt-[100px] pb-20">
      <div className="max-w-3xl mx-auto px-5">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-gray-400 text-sm mb-10">Last updated: {new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })}</p>

        <div className="space-y-8">
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">{section.title}</h2>
              <div className="text-gray-600 leading-relaxed text-sm md:text-base">
                {section.body}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
