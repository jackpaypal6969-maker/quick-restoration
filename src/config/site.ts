/**
 * Single source of truth for business facts, navigation, services, areas and copy.
 * Everything marked TODO is a placeholder to be replaced with the client's real details
 * before launch. Components must read from here — never hard-code business data in JSX.
 */

export type ServiceIconKey =
  | "droplets"
  | "flame"
  | "shield-check"
  | "wind"
  | "biohazard"
  | "cloud-lightning"
  | "air-vent"
  | "hammer";

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface Service {
  slug: string;
  name: string;
  /** Short label for nav/cards */
  shortName: string;
  icon: ServiceIconKey;
  tagline: string;
  /** One or two sentences for cards */
  summary: string;
  /** Long-form paragraphs for the detail page */
  description: string[];
  features: string[];
  steps: { title: string; body: string }[];
  faqs: ServiceFaq[];
  /** Path under /public, or "" when no photo exists yet (components render a branded icon treatment instead). */
  image: string;
  imageAlt: string;
  metaTitle: string;
  metaDescription: string;
}

export interface ServiceArea {
  slug: "nassau-county" | "suffolk-county" | "queens";
  name: string;
  shortName: string;
  county: "Nassau" | "Suffolk" | "Queens";
  headline: string;
  description: string[];
  towns: string[];
  responseNote: string;
  metaTitle: string;
  metaDescription: string;
}

export const siteConfig = {
  name: "Quick Restoration",
  legalName: "Quick Restoration LLC", // TODO: confirm legal entity name
  tagline: "Long Island's rapid-response property restoration team",
  description:
    "24/7 emergency water, fire, mold, storm and sewage damage restoration across Nassau County, Suffolk County and Queens. IICRC certified. NY State licensed mold remediation contractor. Direct insurance billing.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://quickrestorationny.com", // TODO: final domain
  phone: "(631) 555-0199", // TODO: replace with the real 24/7 line
  email: "help@quickrestorationny.com", // TODO: replace
  /** Street address is optional; leave null to show service-area only. */
  address: null as null | { street: string; city: string; state: string; zip: string },
  serviceRegion: "Long Island & Queens, NY",
  hours: "Open 24 hours, 7 days a week, 365 days a year",
  responseTime: "Under 60 minutes",
  founded: 2015, // TODO: confirm
  social: {
    facebook: "", // TODO: add URLs to show icons in the footer
    instagram: "",
    google: "",
    yelp: "",
  },
  credentials: [
    {
      key: "iicrc",
      label: "IICRC Certified Firm",
      detail:
        "Technicians certified by the Institute of Inspection, Cleaning and Restoration Certification in water damage restoration (WRT), applied structural drying (ASD), fire & smoke restoration (FSRT) and applied microbial remediation (AMRT).",
    },
    {
      key: "nys-mold",
      label: "NY State Licensed Mold Remediation Contractor",
      detail:
        "Licensed by the New York State Department of Labor under Article 32 to contain and remediate mold. Assessment and clearance testing are performed by a separate, independently licensed mold assessor, as New York requires. License #MRC-00000.", // TODO: real license number
    },
    {
      key: "insured",
      label: "Fully Licensed & Insured",
      detail: "General liability, pollution liability and workers' compensation coverage on every job.",
    },
    {
      key: "insurance-billing",
      label: "Direct Insurance Billing",
      detail: "We document, photograph and bill your carrier directly. Most covered losses cost clients $0 out of pocket beyond their deductible.",
    },
  ],
  /** Honest, non-fabricated proof points */
  stats: [
    { value: "24/7", label: "Emergency response, 365 days a year" },
    { value: "<60", suffix: "min", label: "Target on-site arrival across our service area" },
    { value: "3", label: "Counties covered: Nassau, Suffolk & Queens" },
    { value: "IICRC", label: "Certified technicians on every crew" },
  ],
  insurers: [
    "State Farm",
    "Allstate",
    "Liberty Mutual",
    "Travelers",
    "USAA",
    "GEICO",
    "NYCM",
    "Chubb",
    "Nationwide",
    "Farmers",
  ],
} as const;

export const nav = {
  primary: [
    { label: "Services", href: "/services", children: true },
    { label: "Service Areas", href: "/service-areas" },
    { label: "About", href: "/about" },
    { label: "Insurance", href: "/#insurance" },
    { label: "Contact", href: "/contact" },
  ],
  cta: { label: "Get Emergency Help", href: "/contact" },
  footer: {
    company: [
      { label: "About Quick Restoration", href: "/about" },
      { label: "Service Areas", href: "/service-areas" },
      { label: "Insurance Claims", href: "/#insurance" },
      { label: "FAQ", href: "/#faq" },
      { label: "Contact", href: "/contact" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
} as const;

export const services: Service[] = [
  {
    slug: "water-damage-restoration",
    name: "Water & Flood Damage Restoration",
    shortName: "Water & Flood Damage",
    icon: "droplets",
    tagline: "Extraction, structural drying and full restoration, starting within the hour.",
    summary:
      "Burst pipes, failed sump pumps, appliance leaks and coastal flooding. We extract standing water, dry the structure to IICRC S500 standards and restore what was damaged.",
    description: [
      "Water moves fast. Within hours it wicks into drywall, subfloor and framing; within 48 hours it can start growing mold. Our crews arrive with truck-mounted extractors, commercial air movers and LGR dehumidifiers so drying begins on the first visit, not the second.",
      "Every job is measured, not guessed. We map moisture with thermal imaging and pin meters, set drying goals, and log daily readings for you and your insurance adjuster. When the structure is dry, we handle the rebuild, so you deal with one team from the first call to the final coat of paint.",
    ],
    features: [
      "24/7 emergency water extraction",
      "Thermal imaging & moisture mapping",
      "Structural drying to IICRC S500",
      "Sewage & Category 3 water handling",
      "Contents pack-out and restoration",
      "Daily drying logs for your adjuster",
    ],
    steps: [
      { title: "Stop the source", body: "We shut off supply lines, tarp roof breaches or coordinate with your plumber before extraction begins." },
      { title: "Extract & stabilize", body: "Standing water is removed, unsalvageable materials are flagged, and antimicrobial treatment is applied." },
      { title: "Dry & monitor", body: "Air movers and dehumidifiers run to a measured drying goal, verified daily with moisture readings." },
      { title: "Restore", body: "Drywall, flooring, trim and paint are replaced to pre-loss condition or better." },
    ],
    faqs: [
      { question: "How fast do you need to start drying?", answer: "Ideally within 24 hours. Mold can begin colonizing wet materials in 24 to 48 hours, and porous materials like carpet pad and drywall lose salvageability the longer they stay wet." },
      { question: "Will my homeowner's insurance cover this?", answer: "Sudden and accidental water losses, such as a burst pipe, are covered by most policies. Flood from rising outside water typically requires a separate flood policy. We document everything either way and bill your carrier directly." },
      { question: "Do I need to leave my home?", answer: "Usually not. Drying equipment is loud but safe. If the water is sewage-contaminated or the loss affects most of the home, we will tell you plainly and help you plan." },
    ],
    image: "/images/services/water-damage.jpg",
    imageAlt: "Technician setting up drying equipment in a flooded Long Island basement",
    metaTitle: "Water & Flood Damage Restoration on Long Island",
    metaDescription:
      "24/7 water damage restoration in Nassau, Suffolk and Queens. IICRC certified extraction, structural drying and rebuild with direct insurance billing.",
  },
  {
    slug: "fire-damage-restoration",
    name: "Fire Damage Restoration",
    shortName: "Fire Damage",
    icon: "flame",
    tagline: "Board-up, cleanup, deodorization and rebuild after a fire.",
    summary:
      "From board-up and debris removal to soot cleaning and full reconstruction, we bring your home back after a kitchen fire, electrical fire or total loss.",
    description: [
      "The hours after a fire are chaotic. Our first job is to secure the property: board-up, roof tarping and emergency power, so nothing gets worse overnight. Then we assess what can be cleaned, what must be replaced, and what your insurance adjuster will need to see.",
      "Fire damage is never just fire. It is water from suppression, smoke that has migrated three rooms away, and odor that has bonded to every porous surface. We restore all of it under one plan, with one project manager who keeps you and your carrier informed at every step.",
    ],
    features: [
      "Emergency board-up and roof tarping",
      "Debris removal and structural cleaning",
      "Soot and smoke residue removal",
      "Thermal fogging and hydroxyl deodorization",
      "Contents cleaning, inventory and storage",
      "Full reconstruction to pre-loss condition",
    ],
    steps: [
      { title: "Secure the site", body: "Board-up, tarping and temporary fencing keep the property safe and satisfy your policy's mitigation duty." },
      { title: "Assess & inventory", body: "We photograph, document and itemize damaged structure and contents for your claim." },
      { title: "Clean & deodorize", body: "Soot is removed with the right chemistry for each surface; odor is neutralized at the molecular level." },
      { title: "Rebuild", body: "Licensed trades handle framing, electrical, plumbing and finishes to bring you home." },
    ],
    faqs: [
      { question: "Can I stay in the house after a fire?", answer: "Only if the fire department has cleared it and the damage is contained. Smoke residue and suppression water can make air quality unsafe; we'll give you an honest recommendation on-site." },
      { question: "What should I do first?", answer: "Call us, then your insurance company. Do not attempt to wipe soot yourself; the wrong cleaner permanently sets it into paint and finishes." },
      { question: "How long does fire restoration take?", answer: "Cleanup of a contained kitchen fire can take one to two weeks. Larger losses with reconstruction run several months. You will have a written schedule before work starts." },
    ],
    image: "/images/services/fire-damage.jpg",
    imageAlt: "Restoration crew cleaning soot from a fire-damaged kitchen",
    metaTitle: "Fire Damage Restoration on Long Island",
    metaDescription:
      "24/7 fire damage restoration in Nassau, Suffolk and Queens: board-up, soot and smoke cleanup, deodorization and full reconstruction with insurance coordination.",
  },
  {
    slug: "mold-remediation",
    name: "Mold Remediation",
    shortName: "Mold Remediation",
    icon: "shield-check",
    tagline: "NY State licensed mold remediation, done to code and verified by clearance testing.",
    summary:
      "New York requires a licensed contractor for mold jobs over 10 square feet. We hold that license, follow the state-mandated remediation plan and stand behind independent clearance testing.",
    description: [
      "Under New York Labor Law Article 32, mold assessment and remediation must be performed by separately licensed companies, following a written remediation plan. Quick Restoration is a NY State licensed mold remediation contractor: we work from an independent assessor's plan, build negative-pressure containment, remove affected materials, HEPA-clean the space and treat the source moisture so it does not return.",
      "Mold is a moisture problem first. Our IICRC applied microbial remediation technicians identify why the area got wet, fix that condition or coordinate with the right trade, and only then declare the job done. A post-remediation clearance test by an independent assessor confirms the air and surfaces are safe.",
    ],
    features: [
      "NY State DOL licensed mold remediation contractor",
      "Work performed to the licensed assessor's remediation plan",
      "Negative-air containment with HEPA filtration",
      "Safe removal and disposal of affected materials",
      "Antimicrobial treatment and HEPA vacuuming",
      "Independent post-remediation clearance testing",
    ],
    steps: [
      { title: "Assessment", body: "An independent licensed mold assessor inspects, samples and writes the remediation plan New York requires." },
      { title: "Containment", body: "We isolate the work area under negative pressure so spores cannot spread to the rest of the home." },
      { title: "Remediation", body: "Affected materials are removed, surfaces are HEPA-vacuumed and treated, and the moisture source is corrected." },
      { title: "Clearance", body: "The assessor re-tests. You receive written clearance before we rebuild." },
    ],
    faqs: [
      { question: "Is a license really required for mold work in New York?", answer: "Yes. Since 2016, New York requires licensed mold assessors and licensed mold remediation contractors for projects over 10 square feet, and the same company cannot do both. Ask any contractor for their license number; ours is on every proposal." },
      { question: "Can you just spray it and paint over it?", answer: "No, and any contractor offering to is breaking state law and leaving the problem in your walls. Mold must be physically removed along with the moisture condition that caused it." },
      { question: "Is mold remediation covered by insurance?", answer: "Often, when the mold results from a covered water loss such as a burst pipe. Mold from long-term neglect or humidity usually is not. We will tell you what we see and document it for your adjuster." },
    ],
    image: "/images/services/mold-remediation.jpg",
    imageAlt: "Technician in protective gear inside a negative-pressure mold containment",
    metaTitle: "Licensed Mold Remediation on Long Island",
    metaDescription:
      "NY State licensed mold remediation contractor serving Nassau, Suffolk and Queens. Containment, removal, HEPA cleaning and independent clearance testing.",
  },
  {
    slug: "smoke-and-soot-cleanup",
    name: "Smoke & Soot Cleanup",
    shortName: "Smoke & Soot",
    icon: "wind",
    tagline: "Remove acidic soot and stubborn smoke odor before they become permanent.",
    summary:
      "Even a small fire leaves soot on every surface and odor in every fabric. We clean, seal and deodorize with the right process for each material.",
    description: [
      "Soot is acidic. Within days it etches metal, discolors grout and yellows paint. Our technicians identify the residue type (dry, wet, protein or fuel-oil) and match the cleaning chemistry, from dry sponging to alkaline wet cleaning, so surfaces are restored instead of smeared.",
      "Odor is removed, not masked. Thermal fogging, hydroxyl generators and sealing of affected framing eliminate smoke odor at its source, including inside HVAC ductwork where it hides.",
    ],
    features: [
      "Residue identification and surface-specific cleaning",
      "HVAC and ductwork cleaning",
      "Thermal fogging and hydroxyl odor removal",
      "Sealing of smoke-affected framing and subfloor",
      "Contents and textile cleaning",
      "Air scrubbing with HEPA filtration",
    ],
    steps: [
      { title: "Inspect", body: "We trace how far smoke traveled, including attics, closets and ducts." },
      { title: "Clean", body: "Every surface is cleaned with chemistry matched to its residue type and material." },
      { title: "Deodorize", body: "Odor molecules are neutralized in the air, in fabrics and inside building cavities." },
      { title: "Verify", body: "We walk the property with you to confirm no residue or odor remains." },
    ],
    faqs: [
      { question: "Can I clean the soot myself?", answer: "We recommend against it. Household cleaners and water spread soot and set it permanently into paint and finishes." },
      { question: "Why does the smell keep coming back?", answer: "Smoke odor bonds to porous materials and hides inside ducts and wall cavities. Air fresheners mask it; only source removal and molecular deodorization eliminate it." },
      { question: "Do you clean furniture and clothing?", answer: "Yes. We inventory, clean and, where needed, store contents off-site while the structure is restored." },
    ],
    image: "/images/services/smoke-soot.jpg",
    imageAlt: "Technician cleaning smoke residue from a living room wall",
    metaTitle: "Smoke & Soot Cleanup on Long Island",
    metaDescription:
      "Professional smoke and soot cleanup in Nassau, Suffolk and Queens. Residue removal, HVAC cleaning and permanent odor elimination, available 24/7.",
  },
  {
    slug: "sewage-cleanup",
    name: "Sewage & Biohazard Cleanup",
    shortName: "Sewage Cleanup",
    icon: "biohazard",
    tagline: "Category 3 water extracted, disinfected and made safe, fast.",
    summary:
      "Sewer backups and cesspool overflows are health emergencies. We extract, remove contaminated materials and sanitize to IICRC S500 Category 3 protocols.",
    description: [
      "Long Island's aging sewer lines and cesspools make sewage backups a common emergency. Black water carries bacteria, viruses and parasites, so this is not a mop-and-bleach job: contaminated porous materials must be removed and every surface disinfected.",
      "Our crews arrive in full PPE with containment and negative air. We extract, remove and bag contaminated materials, apply hospital-grade disinfectants and dry the structure before rebuilding. Documentation is handled for your insurance claim.",
    ],
    features: [
      "24/7 emergency sewage extraction",
      "Full PPE, containment and negative air",
      "Removal and disposal of contaminated materials",
      "Hospital-grade disinfection and ATP verification",
      "Structural drying and odor control",
      "Coordination with plumbers and cesspool services",
    ],
    steps: [
      { title: "Contain", body: "The affected area is sealed and put under negative pressure to protect the rest of the home." },
      { title: "Extract & remove", body: "Black water is extracted; contaminated drywall, flooring and contents are removed and bagged." },
      { title: "Disinfect", body: "Surfaces are cleaned and sanitized with EPA-registered disinfectants and verified." },
      { title: "Dry & rebuild", body: "The structure is dried to a measured goal and rebuilt to pre-loss condition." },
    ],
    faqs: [
      { question: "Is a sewage backup dangerous?", answer: "Yes. Category 3 water contains pathogens that cause serious illness. Keep children and pets away from the area and avoid contact until it is professionally cleaned." },
      { question: "Is sewage cleanup covered by insurance?", answer: "Many policies exclude sewer backup unless you carry a water/sewer backup endorsement. Check your declarations page; we will document the loss either way." },
      { question: "Do you fix the sewer line?", answer: "We handle the cleanup and restoration and coordinate with your plumber or cesspool company for the repair." },
    ],
    image: "/images/services/sewage-cleanup.jpg",
    imageAlt: "Technicians in protective suits extracting water from a contaminated basement",
    metaTitle: "Sewage & Biohazard Cleanup on Long Island",
    metaDescription:
      "Emergency sewage cleanup in Nassau, Suffolk and Queens. Category 3 extraction, disinfection, drying and rebuild with 24/7 response.",
  },
  {
    slug: "storm-damage-restoration",
    name: "Storm & Wind Damage Restoration",
    shortName: "Storm Damage",
    icon: "cloud-lightning",
    tagline: "Nor'easters, hurricanes and coastal flooding: secured tonight, restored properly.",
    summary:
      "Roof tarping, tree-strike board-up, flood extraction and rebuild for Long Island's South Shore, North Shore and the Rockaways.",
    description: [
      "Long Island takes the full force of Atlantic storms. When a nor'easter lifts shingles or a tree comes through the roof, we secure the opening first: tarping, board-up and temporary shoring, then extract water and begin drying before the next front arrives.",
      "Storm losses are often two claims in one: wind damage and water damage. Our project managers understand how carriers separate the two and document each accordingly so your claim moves.",
    ],
    features: [
      "Emergency roof tarping and board-up",
      "Tree-strike and structural shoring",
      "Storm surge and flood extraction",
      "Wind-driven rain and attic drying",
      "Debris removal and site cleanup",
      "Full exterior and interior reconstruction",
    ],
    steps: [
      { title: "Secure", body: "Openings are tarped and boarded, and unsafe structure is shored." },
      { title: "Extract & dry", body: "Water is removed and drying equipment is set throughout affected areas." },
      { title: "Document", body: "Wind and water damage are photographed and itemized separately for your claim." },
      { title: "Rebuild", body: "Roofing, siding, framing and interiors are restored by licensed trades." },
    ],
    faqs: [
      { question: "Do you respond during the storm?", answer: "We dispatch as soon as conditions are safe for our crews, usually before the rain stops. Call and we will give you a real arrival window." },
      { question: "Is storm surge covered?", answer: "Wind damage is covered by most homeowner policies. Rising water from surge or tidal flooding requires flood insurance. We document both separately." },
      { question: "Can you handle my roof replacement?", answer: "Yes. Our reconstruction team includes licensed roofing and siding crews." },
    ],
    image: "/images/services/storm-damage.jpg",
    imageAlt: "Crew tarping a storm-damaged roof on a Long Island home",
    metaTitle: "Storm & Wind Damage Restoration on Long Island",
    metaDescription:
      "24/7 storm damage restoration in Nassau, Suffolk and Queens. Roof tarping, board-up, flood extraction, drying and rebuild with insurance coordination.",
  },
  {
    slug: "puff-back-cleanup",
    name: "Puff Back Cleanup",
    shortName: "Puff Back Cleanup",
    icon: "air-vent",
    tagline: "Oily furnace soot removed from every surface, vent and belonging.",
    summary:
      "A furnace puff back blasts sticky, oily soot through your ductwork into every room. We clean it correctly and get your HVAC system safe to run again.",
    description: [
      "Long Island runs on oil heat, and when a furnace misfires it can send a cloud of oily soot through every register in the house. Unlike dry fire soot, puff back residue smears if you touch it and bonds to paint, fabric and plastic.",
      "Our technicians clean surfaces with degreasing chemistry designed for fuel-oil residue, clean the ductwork and HVAC components, and deodorize the home. We coordinate with your oil company or HVAC technician so the furnace is repaired before it is restarted.",
    ],
    features: [
      "Fuel-oil soot removal from walls, ceilings and contents",
      "Complete ductwork and HVAC cleaning",
      "Textile, upholstery and electronics cleaning",
      "Odor removal and air scrubbing",
      "Repainting and finish restoration",
      "Documentation for your homeowner's claim",
    ],
    steps: [
      { title: "Shut down", body: "The furnace stays off until repaired; we set air scrubbers to capture airborne soot." },
      { title: "Clean", body: "Every affected surface is degreased and cleaned; contents are inventoried and processed." },
      { title: "Duct cleaning", body: "Ductwork and HVAC components are cleaned so soot is not recirculated." },
      { title: "Restore", body: "Walls and ceilings are sealed and repainted where cleaning alone is not enough." },
    ],
    faqs: [
      { question: "Is a puff back covered by insurance?", answer: "Usually, yes. Puff backs are considered sudden and accidental under most homeowner policies. We document and bill your carrier directly." },
      { question: "Can I wipe the soot off myself?", answer: "Please don't. Oily soot smears and sets permanently with ordinary cleaners. Leave surfaces untouched until we arrive." },
      { question: "Is it safe to run the furnace?", answer: "No. Have your heating contractor repair it first; running it again can cause a second puff back." },
    ],
    image: "/images/services/puff-back.jpg",
    imageAlt: "Technician cleaning oily soot residue from a wall near a heating vent",
    metaTitle: "Puff Back Cleanup on Long Island",
    metaDescription:
      "Furnace puff back cleanup in Nassau, Suffolk and Queens. Oily soot removal, duct cleaning, deodorization and insurance coordination, available 24/7.",
  },
  {
    slug: "reconstruction",
    name: "Reconstruction & Rebuild",
    shortName: "Reconstruction",
    icon: "hammer",
    tagline: "One team from mitigation through the last coat of paint.",
    summary:
      "After the damage is stopped and the structure is dry, our licensed build team restores kitchens, bathrooms, basements and whole homes to pre-loss condition or better.",
    description: [
      "Most restoration companies dry the house and leave. Quick Restoration finishes the job. Our reconstruction division handles framing, drywall, insulation, flooring, cabinetry, trim, paint and the licensed electrical and plumbing work in between, under the same project manager who ran your mitigation.",
      "Because we wrote the mitigation scope, we know exactly what was removed and why. That means no gaps between the mitigation estimate and the rebuild estimate, and no arguing between two contractors about whose problem something is.",
    ],
    features: [
      "Full-service rebuild after water, fire, mold or storm loss",
      "Licensed electrical, plumbing and HVAC trades",
      "Kitchens, bathrooms, basements and additions",
      "Roofing, siding and exterior repairs",
      "Xactimate estimates that match your adjuster's",
      "One project manager, one schedule, one point of contact",
    ],
    steps: [
      { title: "Scope", body: "We write a line-item rebuild estimate in the same format your insurance adjuster uses." },
      { title: "Plan", body: "Selections, permits and scheduling are locked before the first trade arrives." },
      { title: "Build", body: "Licensed crews rebuild in sequence with daily updates from your project manager." },
      { title: "Walkthrough", body: "We walk the finished work with you and close the claim with your carrier." },
    ],
    faqs: [
      { question: "Do I have to use your rebuild team?", answer: "No. You are always free to choose your own contractor. Most clients stay with us because one team means fewer delays and a single point of accountability." },
      { question: "Can you upgrade materials during the rebuild?", answer: "Yes. Insurance covers like-for-like replacement; you can pay the difference for upgrades and we will itemize it clearly." },
      { question: "Do you pull permits?", answer: "Yes. All work requiring a permit is filed with your town or the NYC Department of Buildings as applicable." },
    ],
    image: "/images/services/reconstruction.jpg",
    imageAlt: "Carpenter finishing drywall in a rebuilt Long Island living room",
    metaTitle: "Reconstruction & Rebuild Services on Long Island",
    metaDescription:
      "Post-loss reconstruction in Nassau, Suffolk and Queens. Licensed rebuild of kitchens, basements and whole homes with estimates that match your adjuster's.",
  },
];

export const serviceAreas: ServiceArea[] = [
  {
    slug: "nassau-county",
    name: "Nassau County",
    shortName: "Nassau",
    county: "Nassau",
    headline: "Restoration crews across Nassau County, from Great Neck to Massapequa.",
    description: [
      "Nassau County's older housing stock, high water tables along the South Shore and dense neighborhoods make fast water and mold response essential. Our crews are staged to reach any Nassau address within the hour.",
      "We work regularly with Nassau homeowners, co-op boards and property managers, and we know the permitting requirements of every town and village in the county.",
    ],
    towns: [
      "Hempstead", "Garden City", "Long Beach", "Great Neck", "Manhasset", "Port Washington", "Oyster Bay", "Glen Cove",
      "Massapequa", "Levittown", "Freeport", "Rockville Centre", "Valley Stream", "Mineola", "Hicksville", "Syosset",
      "Westbury", "Merrick", "Bellmore", "Wantagh", "Oceanside", "Lynbrook", "Roslyn", "Plainview",
    ],
    responseNote: "Typical arrival: 30 to 60 minutes anywhere in Nassau County.",
    metaTitle: "Water, Fire & Mold Restoration in Nassau County, NY",
    metaDescription:
      "24/7 emergency restoration across Nassau County. IICRC certified, NY State licensed mold contractor, direct insurance billing. Crews on-site in under an hour.",
  },
  {
    slug: "suffolk-county",
    name: "Suffolk County",
    shortName: "Suffolk",
    county: "Suffolk",
    headline: "Rapid response from Huntington to Montauk, both forks included.",
    description: [
      "Suffolk County is big, coastal and largely on cesspools and private wells, which means sewage backups, storm surge and basement flooding are part of life here. We are based in Suffolk and built our dispatch around its geography.",
      "From the Town of Babylon to the East End, we serve homeowners, second-home owners, restaurants and commercial properties, with the same crews and the same standards on every job.",
    ],
    towns: [
      "Huntington", "Babylon", "Islip", "Smithtown", "Brookhaven", "Bay Shore", "Patchogue", "Riverhead",
      "Southampton", "East Hampton", "Commack", "Hauppauge", "Stony Brook", "Port Jefferson", "Sayville", "Northport",
      "Lindenhurst", "Deer Park", "Ronkonkoma", "Medford", "Shirley", "Mastic", "Centereach", "Holbrook",
    ],
    responseNote: "Typical arrival: under 60 minutes in western and central Suffolk; East End arrival windows quoted at time of call.",
    metaTitle: "Water, Fire & Mold Restoration in Suffolk County, NY",
    metaDescription:
      "24/7 emergency restoration across Suffolk County, from Huntington to the East End. IICRC certified, NY State licensed mold contractor, direct insurance billing.",
  },
  {
    slug: "queens",
    name: "Queens",
    shortName: "Queens",
    county: "Queens",
    headline: "NYC-compliant restoration for Queens homes, co-ops and commercial buildings.",
    description: [
      "Queens brings its own rules: NYC Department of Buildings permits, co-op and condo board approvals, alternate-side parking and multi-family buildings where one leak affects three apartments. We handle all of it.",
      "Our crews cover every Queens neighborhood, from Astoria and Long Island City to Bayside, Jamaica and the Rockaways, with the same 24/7 response we provide on Long Island.",
    ],
    towns: [
      "Astoria", "Long Island City", "Flushing", "Bayside", "Jamaica", "Forest Hills", "Jackson Heights", "Ridgewood",
      "Howard Beach", "Whitestone", "Douglaston", "Fresh Meadows", "Rego Park", "Woodside", "Richmond Hill", "Far Rockaway",
      "Sunnyside", "Elmhurst", "Kew Gardens", "Glendale", "Maspeth", "College Point", "Ozone Park", "Little Neck",
    ],
    responseNote: "Typical arrival: under 60 minutes across Queens, traffic permitting; we quote a real window when you call.",
    metaTitle: "Water, Fire & Mold Restoration in Queens, NY",
    metaDescription:
      "24/7 emergency restoration throughout Queens. IICRC certified, NY State licensed mold contractor, NYC DOB-compliant, direct insurance billing.",
  },
];

export const processSteps = [
  {
    title: "Call, any hour",
    body: "A live dispatcher answers 24/7, takes the details and gets a crew moving while you are still on the phone.",
  },
  {
    title: "On-site in under an hour",
    body: "A certified crew arrives with extraction, drying and containment equipment on the truck, not on order.",
  },
  {
    title: "Assess and document",
    body: "Moisture mapping, photos and a written scope, so you and your adjuster see exactly what happened and what it takes to fix.",
  },
  {
    title: "Mitigate and restore",
    body: "We stop the damage, dry or clean the structure to IICRC standards, and rebuild to pre-loss condition.",
  },
  {
    title: "Insurance and walkthrough",
    body: "We bill your carrier directly, answer the adjuster's questions and walk the finished work with you before we call it done.",
  },
] as const;

export const faqs = [
  {
    question: "How quickly can you get here?",
    answer:
      "Our target is on-site within 60 minutes anywhere in Nassau County, Suffolk County or Queens, 24 hours a day, every day of the year. When you call, the dispatcher gives you a real arrival window based on where the closest crew is.",
  },
  {
    question: "Are you actually certified and licensed?",
    answer:
      "Yes. Quick Restoration is an IICRC certified firm, and we hold a New York State Department of Labor mold remediation contractor license. Our license number appears on every proposal and you are welcome to verify it with the state.",
  },
  {
    question: "Do you work directly with my insurance company?",
    answer:
      "Yes. We photograph and document the loss, write estimates in the same software your adjuster uses, and bill your carrier directly. For covered losses, most clients pay nothing beyond their deductible.",
  },
  {
    question: "What areas do you cover?",
    answer:
      "All of Nassau County, all of Suffolk County including the North and South Forks, and every neighborhood in Queens. If you are unsure, call; we will tell you honestly whether we are the right fit.",
  },
  {
    question: "What should I do while I wait for your crew?",
    answer:
      "If it is safe: shut off the water source, turn off electricity to flooded areas, move valuables off the floor and avoid walking on wet carpet. Do not try to clean soot or mold yourself. Our dispatcher will walk you through it.",
  },
  {
    question: "Do you charge more for nights, weekends or holidays?",
    answer:
      "No. Emergencies do not keep business hours and neither do we. Our rates are the same at 3 a.m. on a Sunday as they are on a Tuesday afternoon.",
  },
] as const;

/**
 * SAMPLE reviews for the client preview. `sample: true` renders a small
 * "sample reviews" notice; flip it to false once real reviews are pasted in.
 */
export const testimonials = {
  sample: true,
  items: [
    {
      quote:
        "A pipe burst above our finished basement at 1 a.m. The crew was in our driveway before 2 and had the water out that night. They handled everything with our insurance company.",
      name: "Michael R.",
      location: "Massapequa, NY",
      service: "Water Damage",
    },
    {
      quote:
        "After a kitchen fire we didn't know where to start. One project manager, one schedule, and the kitchen honestly looks better than before. They kept us informed every single day.",
      name: "Danielle S.",
      location: "Huntington, NY",
      service: "Fire Damage",
    },
    {
      quote:
        "We found mold behind the bathroom wall during a renovation. They explained the New York licensing rules, set up containment the same day and the clearance test came back clean.",
      name: "James D.",
      location: "Bayside, Queens",
      service: "Mold Remediation",
    },
    {
      quote:
        "The nor'easter put a tree through our roof. They tarped it in the rain that afternoon, dried the attic and rebuilt the whole section. The insurance paperwork was painless.",
      name: "Karen P.",
      location: "Long Beach, NY",
      service: "Storm Damage",
    },
    {
      quote:
        "Our furnace puffed back and coated every room in oily soot. I thought we'd have to repaint the whole house. They cleaned it, cleaned the ducts, and you'd never know it happened.",
      name: "Tom G.",
      location: "Patchogue, NY",
      service: "Puff Back",
    },
    {
      quote:
        "Sewer backup in a two-family house in Astoria. They contained it, cleaned it properly and coordinated with the plumber and the board. Professional from the first call.",
      name: "Angela N.",
      location: "Astoria, Queens",
      service: "Sewage Cleanup",
    },
  ],
} as const;

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}

export function getServiceArea(slug: string) {
  return serviceAreas.find((a) => a.slug === slug);
}
