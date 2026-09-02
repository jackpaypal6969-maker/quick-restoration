import { serviceAreas, services, siteConfig } from "@/config/site";
import { absoluteUrl, phoneE164 } from "@/lib/seo";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const ORGANIZATION_ID = absoluteUrl("/#organization");
const WEBSITE_ID = absoluteUrl("/#website");

/** Only credentials with a recognised issuing body become schema.org credentials. */
const CREDENTIAL_ISSUERS: Record<string, { category: string; issuer: string }> = {
  iicrc: {
    category: "certification",
    issuer: "Institute of Inspection, Cleaning and Restoration Certification",
  },
  "nys-mold": {
    category: "license",
    issuer: "New York State Department of Labor",
  },
};

function buildAreaServed() {
  return serviceAreas.map((area) => ({
    "@type": "AdministrativeArea",
    name: `${area.name}, NY`,
    containedInPlace: { "@type": "State", name: "New York" },
  }));
}

function buildCredentials() {
  return siteConfig.credentials.flatMap((credential) => {
    const issuer = CREDENTIAL_ISSUERS[credential.key];
    if (!issuer) return [];
    return [
      {
        "@type": "EducationalOccupationalCredential",
        name: credential.label,
        description: credential.detail,
        credentialCategory: issuer.category,
        recognizedBy: { "@type": "Organization", name: issuer.issuer },
      },
    ];
  });
}

function buildGraph() {
  const areaServed = buildAreaServed();
  const telephone = phoneE164(siteConfig.phone);
  const sameAs = (Object.values(siteConfig.social) as string[]).filter((href) => href.length > 0);
  const { address } = siteConfig;

  const organization = {
    "@type": ["HomeAndConstructionBusiness", "LocalBusiness"],
    "@id": ORGANIZATION_ID,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: absoluteUrl("/"),
    telephone,
    email: siteConfig.email,
    image: absoluteUrl("/images/hero.jpg"),
    logo: absoluteUrl("/icon.svg"),
    description: siteConfig.description,
    slogan: siteConfig.tagline,
    foundingDate: String(siteConfig.founded),
    ...(address
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: address.street,
            addressLocality: address.city,
            addressRegion: address.state,
            postalCode: address.zip,
            addressCountry: "US",
          },
        }
      : {}),
    areaServed,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: DAYS,
        opens: "00:00",
        closes: "23:59",
      },
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone,
        email: siteConfig.email,
        contactType: "emergency",
        areaServed: "US",
        availableLanguage: "English",
        hoursAvailable: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: DAYS,
          opens: "00:00",
          closes: "23:59",
        },
      },
    ],
    hasCredential: buildCredentials(),
    knowsAbout: services.map((service) => service.name),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };

  const website = {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: siteConfig.name,
    url: absoluteUrl("/"),
    inLanguage: "en-US",
    publisher: { "@id": ORGANIZATION_ID },
  };

  const serviceNodes = services.map((service) => ({
    "@type": "Service",
    "@id": absoluteUrl(`/services/${service.slug}#service`),
    name: service.name,
    serviceType: service.name,
    description: service.summary,
    url: absoluteUrl(`/services/${service.slug}`),
    provider: { "@id": ORGANIZATION_ID },
    areaServed,
  }));

  return {
    "@context": "https://schema.org",
    "@graph": [organization, website, ...serviceNodes],
  };
}

/**
 * Site-wide structured data: the business, the website and one Service node
 * per offering. Rendered once from the root layout. The JSON is serialised
 * with "<" escaped so nothing inside it can close the script element.
 */
export function JsonLd() {
  const json = JSON.stringify(buildGraph()).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
