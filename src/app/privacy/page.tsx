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
  title: "Privacy Policy",
  description: `How ${siteConfig.name} handles the information you share through this website and on the phone: what the contact form collects, why, where it goes, how long it is kept and how to have it deleted.`,
  path: "/privacy",
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
    id: "who-we-are",
    heading: "Who we are",
    content: [
      <>
        {siteConfig.legalName} (&ldquo;{siteConfig.name}&rdquo;, &ldquo;we&rdquo;) is a property damage restoration
        contractor serving {countySentence}. We run this website and the 24/7 phone line on it. Questions about this
        policy go to <EmailLink />.
      </>,
    ],
  },
  {
    id: "what-we-collect",
    heading: "What the contact form collects",
    content: [
      "The contact form asks for what a dispatcher needs to help you:",
      {
        list: [
          "Your name and the phone number to call you back on",
          "An email address, if you give one, for written follow-up",
          "The property address or town, so we know which crew is closest",
          "The type of damage and whether it is happening right now",
          "Anything you type into the message box",
        ],
      },
      "When the form is submitted, our server also records the IP address and time of the request. That is used to stop automated spam and repeated submissions, not to profile you.",
      "If you call instead, we take the same details over the phone and write them into the same dispatch record.",
    ],
  },
  {
    id: "why-we-collect-it",
    heading: "Why we collect it",
    content: [
      "We use what you give us for three things: dispatch (getting the right crew to the right address with the right equipment), follow-up (calling or emailing you back about an estimate, a schedule or a question) and, if you become a client, the job file that documents the work for you and for your insurance claim.",
      "We do not use your details for any other purpose. We do not build marketing lists from form submissions and we do not send newsletters or promotional texts. If you asked us about a leak, the only thing you will hear from us is about the leak.",
    ],
  },
  {
    id: "where-it-goes",
    heading: "Where your information goes and how it is stored",
    content: [
      "Form submissions are emailed to our dispatch inbox and kept on our web server so a dispatcher can see them even if an email is delayed. Email is delivered through a transactional email provider that processes messages on our behalf and is not permitted to use them for anything else.",
      "We do not sell personal information, and we do not share it with advertisers or data brokers. We share it only in these cases:",
      {
        list: [
          "With the insurance carrier or adjuster you name, at your direction, as part of documenting a claim",
          "With a licensed subcontractor, such as an electrician or plumber, working on your job, limited to what they need for the work",
          "With a licensed mold assessor when New York law requires an independent assessment",
          "When a court order, subpoena or law requires it",
        ],
      },
    ],
  },
  {
    id: "calls-and-texts",
    heading: "Phone calls and text messages",
    content: [
      "By giving us your phone number, on the form or over the phone, you agree that we may call or text that number about your request: to confirm an address, give an arrival window, send an estimate or ask a question about the job. Standard message and data rates from your carrier may apply.",
      "We do not send marketing text messages. To stop texts at any time, reply STOP to any message or tell the dispatcher, and we will call instead. If a call is ever recorded for dispatch accuracy or training, you will be told at the start of the call.",
    ],
  },
  {
    id: "cookies",
    heading: "Cookies and tracking",
    content: [
      "This website does not use advertising cookies, analytics cookies or any third-party tracking scripts, and it does not embed social media widgets. Any cookie or browser storage it uses is strictly necessary to serve the page or to protect the contact form against abuse, and none of it identifies you across other websites.",
      "Because of this there is no cookie banner to click through and nothing to opt out of. If that ever changes, this page will say so before it does.",
    ],
  },
  {
    id: "retention",
    heading: "How long we keep it",
    content: [
      "Form submissions, and the emails and notes that follow them, are kept for 24 months from our last contact with you so we can pick up an estimate or claim where it left off. Server logs that contain IP addresses are rotated within 90 days.",
      "If you become a client, your job file (photos, moisture logs, scope, invoices and insurance correspondence) is kept for as long as New York law and our insurers require, which is generally seven years from the end of the job.",
    ],
  },
  {
    id: "your-choices",
    heading: "Access, correction and deletion",
    content: [
      <>
        You can ask to see the personal information we hold about you, have it corrected, or have it deleted. Email{" "}
        <EmailLink /> from the address you gave us, or call <PhoneLink /> and ask for the office. We will confirm what
        we have done within 30 days.
      </>,
      "We cannot delete records that are part of a job still in progress, an open insurance claim or a record we are legally required to keep, but we will tell you exactly what remains and why, and delete the rest.",
    ],
  },
  {
    id: "children",
    heading: "Children",
    content: [
      "This website is for property owners, managers and tenants and is not directed at children under 13. We do not knowingly collect information from children. If you believe a child has submitted the form, email us and we will remove it.",
    ],
  },
  {
    id: "security",
    heading: "Security",
    content: [
      "The site is served over HTTPS only. Dispatch records are accessible to the office and dispatch staff who need them to do their jobs, and nothing else. We do not take payment card details through this website; any payment is arranged directly with the office.",
    ],
  },
  {
    id: "changes",
    heading: "Changes to this policy",
    content: [
      "If we change how we handle your information, we will update this page and the effective date at the top. A material change, such as adding analytics, will be noted here before it takes effect.",
    ],
  },
  {
    id: "contact",
    heading: "Contact",
    content: [
      <>
        Privacy questions, requests and complaints: <EmailLink />, or <PhoneLink /> any hour. Put &ldquo;Privacy&rdquo;
        in the subject line so it reaches the right person.
      </>,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        compact
        eyebrow="Privacy"
        title="Privacy policy"
        description="What we collect, why we collect it, and how to have it deleted. Written to be read, not scrolled past."
        breadcrumbs={[{ label: "Privacy Policy", href: "/privacy" }]}
      />
      <LegalDocument
        effective={EFFECTIVE}
        intro="This policy explains what we collect when you use this website or call us, why we collect it, where it goes and how to have it removed. It is short because we collect very little."
        sections={sections}
      />
    </>
  );
}
