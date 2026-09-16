import type { Metadata } from "next";

const SITE_URL = "https://mtiskari.ge";
const COMPANY_EMAIL = "metreveliteona@yahoo.com";
const COMPANY_PHONE = "+995 551 09 38 09";
const COMPANY_ADDRESS = "სოფელი უწერა, რაჭა, საქართველო (Village Utsera, Racha, Georgia)";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Booking terms and conditions for Mtiskari cottages.",
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/terms`,
    title: "Terms & Conditions • Mtiskari",
    description: "Booking terms and conditions for Mtiskari cottages.",
  },
};

const SECTIONS: { title: string; body: React.ReactNode }[] = [
  {
    title: "1. Introduction",
    body: (
      <p>
        These Terms & Conditions govern your booking and stay at Mtiskari, located in{" "}
        {COMPANY_ADDRESS}. By submitting a booking request through our website, you agree to
        these terms.
      </p>
    ),
  },
  {
    title: "2. Bookings",
    body: (
      <p>
        A booking request submitted through our website is not confirmed until you receive a
        confirmation email from us. We reserve the right to accept or decline any booking
        request at our discretion, for example due to unavailability or scheduling conflicts.
      </p>
    ),
  },
  {
    title: "3. Check-in / check-out",
    body: (
      <p>
        Standard check-in and check-out times are communicated at the time of booking
        confirmation. Early check-in or late check-out may be available on request, subject to
        availability.
      </p>
    ),
  },
  {
    title: "4. Cancellations",
    body: (
      <p>
        If you need to cancel or modify your booking, please contact us as soon as possible. If
        we cancel a confirmed booking on our end, we will notify you by email as soon as
        possible. Refund eligibility, if applicable, will be communicated at that time.
      </p>
    ),
  },
  {
    title: "5. Guest conduct",
    body: (
      <p>
        Guests are expected to treat the property, its furnishings, and surroundings with care.
        Guests are responsible for any damage caused to the property during their stay beyond
        normal wear and tear.
      </p>
    ),
  },
  {
    title: "6. Occupancy",
    body: (
      <p>
        The number of guests must not exceed the maximum occupancy specified for the booked
        cottage. Bookings made with inaccurate guest counts may be subject to cancellation or an
        additional charge.
      </p>
    ),
  },
  {
    title: "7. Liability",
    body: (
      <p>
        Mtiskari is not liable for loss, theft, or damage to personal belongings during your
        stay, except where required by applicable law. Guests use amenities and outdoor areas at
        their own risk.
      </p>
    ),
  },
  {
    title: "8. Changes to these terms",
    body: (
      <p>
        We may update these Terms & Conditions from time to time. The version in effect at the
        time of your booking confirmation applies to your stay.
      </p>
    ),
  },
  {
    title: "9. Contact",
    body: (
      <p>
        For any questions regarding these terms, please contact us at{" "}
        <a href={`mailto:${COMPANY_EMAIL}`} className="text-green-700 underline">
          {COMPANY_EMAIL}
        </a>{" "}
        or {COMPANY_PHONE}.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <section className="w-full min-h-screen mt-[100px] pb-20">
      <div className="max-w-3xl mx-auto px-5">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Terms & Conditions</h1>
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
