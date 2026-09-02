import type { Service } from "@/config/site";
import { absoluteUrl } from "@/lib/seo";

interface ServiceJsonLdProps {
  service: Service;
}

/**
 * Page-level structured data for a service detail page: BreadcrumbList and
 * FAQPage. The Service node itself lives in the site-wide <JsonLd> graph under
 * the same @id, so it is deliberately not repeated here. Built with
 * JSON.stringify and "<" escaped so the inline script can never be broken out of.
 */
export function ServiceJsonLd({ service }: ServiceJsonLdProps) {
  const url = absoluteUrl(`/services/${service.slug}`);

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Services", item: absoluteUrl("/services") },
          { "@type": "ListItem", position: 3, name: service.shortName, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: service.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };

  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
