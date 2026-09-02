import type { Metadata, Viewport } from "next";
import { Manrope, Syne } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileCallBar } from "@/components/layout/MobileCallBar";
import { JsonLd } from "@/components/seo/JsonLd";
import { MotionProvider } from "@/components/ui/MotionProvider";

/**
 * Hydration-independent scroll reveal for <Reveal> (src/components/ui/Reveal.tsx).
 * Runs as the first thing in <body>, before any HTML below it is parsed, so
 * sections in the initial viewport start their CSS transition on the first
 * frame instead of waiting ~2s for the JS bundle. PREP marks elements within
 * 600px so will-change is applied only while about to animate; REVEAL fires
 * 140px before the element enters the viewport (positive bottom rootMargin
 * expands the root). Any failure marks everything revealed so content can
 * never be left hidden. Plain ES2017, no template literals.
 */
const REVEAL_SCRIPT = `(function(){
var doc=document;
function all(){return doc.querySelectorAll('[data-reveal]');}
function show(el){el.setAttribute('data-revealed','');el.removeAttribute('data-reveal-pending');}
function showAll(){var els=all();for(var i=0;i<els.length;i++)show(els[i]);}
function fail(){try{showAll();doc.addEventListener('DOMContentLoaded',showAll);window.addEventListener('load',showAll);}catch(e){}}
try{
if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches){showAll();return;}
var seen=new WeakSet();
var prep=null,reveal=null;
function done(el){
var t=setTimeout(clear,1500);
function clear(){clearTimeout(t);el.removeEventListener('transitionend',onEnd);el.removeAttribute('data-reveal-pending');}
function onEnd(e){if(e.target===el)clear();}
el.addEventListener('transitionend',onEnd);
el.setAttribute('data-revealed','');
}
if('IntersectionObserver' in window){
prep=new IntersectionObserver(function(entries){
for(var i=0;i<entries.length;i++){var el=entries[i].target;
if(entries[i].isIntersecting&&!el.hasAttribute('data-revealed'))el.setAttribute('data-reveal-pending','');}
},{rootMargin:'600px 0px 600px 0px'});
reveal=new IntersectionObserver(function(entries){
for(var i=0;i<entries.length;i++){if(!entries[i].isIntersecting)continue;
var el=entries[i].target;prep.unobserve(el);reveal.unobserve(el);done(el);}
},{rootMargin:'0px 0px 140px 0px',threshold:0});
}
function observe(el){
if(seen.has(el))return;
seen.add(el);
if(el.hasAttribute('data-revealed'))return;
if(!reveal){show(el);return;}
prep.observe(el);reveal.observe(el);
}
function scan(node){
if(node.nodeType!==1)return;
if(node.matches('[data-reveal]'))observe(node);
var els=node.querySelectorAll('[data-reveal]');
for(var i=0;i<els.length;i++)observe(els[i]);
}
scan(doc.documentElement);
doc.addEventListener('DOMContentLoaded',function(){scan(doc.documentElement);});
new MutationObserver(function(records){
for(var i=0;i<records.length;i++){var added=records[i].addedNodes;
for(var j=0;j<added.length;j++)scan(added[j]);}
}).observe(doc.documentElement,{childList:true,subtree:true});
}catch(e){fail();}
})();`;

const syne = Syne({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | 24/7 Water, Fire & Mold Restoration on Long Island`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "water damage restoration Long Island",
    "fire damage restoration Long Island",
    "mold remediation Long Island",
    "licensed mold contractor NY",
    "IICRC certified restoration",
    "emergency restoration Nassau County",
    "emergency restoration Suffolk County",
    "emergency restoration Queens",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: siteConfig.name,
    title: `${siteConfig.name} | 24/7 Emergency Property Restoration`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | 24/7 Emergency Property Restoration`,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f0a28",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${manrope.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        {/* First in <body> so reveals start before the rest of the HTML parses. */}
        <script dangerouslySetInnerHTML={{ __html: REVEAL_SCRIPT }} />
        {/* Without JS, motion/reveal elements would keep their server-rendered opacity:0. */}
        <noscript>
          <style>{`[data-motion],[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <MotionProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-electric-400 focus:px-5 focus:py-3 focus:font-semibold focus:text-midnight-950"
          >
            Skip to content
          </a>
          <JsonLd />
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <MobileCallBar />
        </MotionProvider>
      </body>
    </html>
  );
}
