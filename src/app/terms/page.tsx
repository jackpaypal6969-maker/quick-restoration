import type { Metadata } from "next";
import { serviceAreas, siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { telHref } from "@/lib/utils";
import { PageHero } from "@/components/sections/PageHero";
import { LegalDocument, type LegalSection } from "@/components/seo/LegalDocument";

const EFFECTIVE = "September 2026";

const counties = serviceAreas.map((area) => area.name);
const countySentence = `${counties.slice(0, -1).join(", ")} and ${counties[counties.length - 1]}`;

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service",
  description: `The terms for using the ${siteConfig.name} website: emergencies belong on the phone, estimates are not binding until written, insurance outcomes are not guaranteed, and New York law governs.`,
  path: "/terms",
});

const linkClass = "font-semibold text-royal-600 underline-offset-4 hover:underline";

function EmailLink() {
  return (
    <a href={`mailto:${siteConfig.email}`} className={linkClass}>
      {siteConfig.email}
    </a>
  );
}

function PhoneLink() {
  return (
    <a href={telHref(siteConfig.phone)} className={linkClass}>
      {siteConfig.phone}
    </a>
  );
}

const sections: LegalSection[] = [
  {
    id: "what-this-site-is-for",
    heading: "What this website is for",
    content: [
      `This site describes the services ${siteConfig.name} offers across ${countySentence} and gives you ways to reach us. Reading it, or sending a form, does not by itself make you a client or create a contract. A customer relationship starts when you sign a written work authorization.`,
    ],
  },
  {
    id: "emergencies",
    heading: "Emergencies belong on the phone",
    content: [
      <>
        The contact form is read by a dispatcher, but it is not monitored the way the phone is, and we cannot guarantee
        how quickly a web form will be answered. If water is running, smoke is present or sewage is backing up, call{" "}
        <PhoneLink />. A person answers 24 hours a day.
      </>,
      `Our target of being on site in ${siteConfig.responseTime.toLowerCase()} applies to emergency calls dispatched by phone within our service area. It is a target we plan around, not a guarantee: traffic, weather, crew availability and the East End of Suffolk County can stretch it. The dispatcher will give you a real arrival window when you call.`,
    ],
  },
  {
    id: "estimates",
    heading: "Estimates and pricing",
    content: [
      "Any figure on this site, on the phone or on a walkthrough is an estimate. Nothing is binding on either of us until it is in a written scope of work and work authorization that you have signed. Restoration uncovers hidden damage; if the scope needs to change, we document the change in writing and get your approval before the additional work proceeds.",
    ],
  },
  {
    id: "insurance",
    heading: "Insurance claims",
    content: [
      "We document losses, work with adjusters and bill carriers directly wherever a policy allows it. Coverage decisions, however, belong to your insurer. We do not guarantee that a claim will be approved, that a deductible will be waived or that a carrier will pay any particular amount, and we do not offer to absorb deductibles. You remain responsible for any part of the work your policy does not cover, including your deductible.",
    ],
  },
  {
    id: "credentials",
    heading: "Licensing and credentials",
    content: [
      `${siteConfig.name} is an IICRC Certified Firm and a mold remediation contractor licensed by the New York State Department of Labor under Article 32 of the Labor Law. New York requires the mold assessment and the mold remediation on a project to be performed by different licensed companies. We are the remediation contractor; where an assessment is required, we will refer you to an independent licensed assessor.`,
    ],
  },
  {
    id: "acceptable-use",
    heading: "Using the site",
    content: [
      "You agree not to submit false emergency requests, impersonate someone else, use the form to send spam or abuse, attempt to interfere with the site or its contact form, or scrape the site's content. We rate-limit and may block traffic that does any of these.",
    ],
  },
  {
    id: "intellectual-property",
    heading: "Content and intellectual property",
    content: [
      `The text, photographs, graphics and the ${siteConfig.name} name and mark on this site belong to ${siteConfig.legalName} or are used under license. You are welcome to link to any page. Please do not copy, reproduce or republish the content without written permission.`,
    ],
  },
  {
    id: "accuracy",
    heading: "Accuracy and warranties",
    content: [
      "We keep this site accurate and current, but it is general information and is provided as is. It is not engineering, legal or insurance advice, and it does not replace an on-site inspection. Conditions in your property may differ from anything described here.",
    ],
  },
  {
    id: "liability",
    heading: "Limitation of liability",
    content: [
      `To the fullest extent New York law allows, ${siteConfig.legalName} is not liable for any loss arising from your use of, or reliance on, this website, or from being unable to reach us through it. Nothing on this page limits liability that cannot be limited by law, and nothing here limits or replaces the terms of a signed work authorization, which govern the restoration work itself.`,
    ],
  },
  {
    id: "governing-law",
    heading: "Governing law",
    content: [
      "These terms are governed by the laws of the State of New York, without regard to its conflict-of-law rules. Any dispute about this website will be heard in the state or federal courts located in New York.",
    ],
  },
  {
    id: "changes",
    heading: "Changes to these terms",
    content: [
      "We may update these terms from time to time. The effective date at the top tells you when they last changed, and continued use of the site after a change means you accept the updated terms.",
    ],
  },
  {
    id: "contact",
    heading: "Contact",
    content: [
      <>
        Questions about these terms: <EmailLink /> or <PhoneLink />.
      </>,
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHero
        compact
        eyebrow="Terms"
        title="Terms of service"
        description="Plain terms for using this website. Emergencies belong on the phone, estimates are not final until written, and New York law governs."
        breadcrumbs={[{ label: "Terms of Service", href: "/terms" }]}
      />
      <LegalDocument
        effective={EFFECTIVE}
        intro="These terms cover your use of this website. They are separate from the written work authorization you sign before any restoration work starts; that document, not this page, governs the job itself."
        sections={sections}
      />
    </>
  );
}
