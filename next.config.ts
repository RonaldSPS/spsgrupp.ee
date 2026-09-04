import type { NextConfig } from "next";

// ASCII-only legacy redirects live here. Non-ASCII (Cyrillic) legacy redirects
// live in proxy.ts (LEGACY_RU_REDIRECTS) - next.config redirect matching runs
// against the percent-encoded pathname, so Cyrillic sources never match here.
const localizedLegacyRedirects = [
  ["/en/cleaning-services-in-tallinn/cleaning-up-retail-spaces", "/en/cleaning-services-in-tallinn/retail-cleaning/"],
  ["/en/cleaning-services-in-tallinn/cleaning-of-industrial-buildings", "/en/cleaning-services-in-tallinn/industrial-cleaning/"],
  ["/en/cleaning-services-for-business-clients", "/en/specialist-cleaning-services/"],
  ["/en/cleaning-services-for-business-clients/post-construction-cleaning", "/en/specialist-cleaning-services/post-construction-cleaning/"],
  ["/en/cleaning-services-for-business-clients/deep-cleaning-of-escalators", "/en/specialist-cleaning-services/escalator-deep-cleaning/"],
  ["/en/cleaning-services-for-business-clients/disinfection-and-post-virus-cleaning", "/en/specialist-cleaning-services/disinfection/"],
  ["/en/cleaning-services-for-business-clients/professional-floor-maintenance-in-tallinn", "/en/specialist-cleaning-services/floor-maintenance/"],
  ["/en/cleaning-services-for-business-clients/smoke-and-fire-damage-cleaning", "/en/specialist-cleaning-services/fire-and-smoke-damage-cleaning/"],
  ["/en/cleaning-services-for-business-clients/carpet-cleaning", "/en/specialist-cleaning-services/carpet-cleaning/"],
  ["/en/repair-services-in-tallinn/plating", "/en/repair-services-in-tallinn/tiling/"],
  ["/en/repair-services-in-tallinn/sanitary-renovation-and-conversion", "/en/repair-services-in-tallinn/washroom-renovation/"],
  ["/en/repair-services-in-tallinn/pipeworks", "/en/repair-services-in-tallinn/plumbing/"],
  ["/en/repair-services-in-tallinn/construction-and-maintenance-of-ventilation-systems", "/en/repair-services-in-tallinn/ventilation-installation-and-maintenance/"],
  ["/en/professional-exterior-cleaning", "/en/outdoor-cleaning-and-grounds-care/"],
  ["/en/professional-exterior-cleaning/professional-window-cleaning-in-tallinn", "/en/outdoor-cleaning-and-grounds-care/window-cleaning/"],
  ["/en/professional-exterior-cleaning/professional-facade-cleaning", "/en/outdoor-cleaning-and-grounds-care/facade-cleaning/"],
  ["/en/professional-exterior-cleaning/graffiti-removal", "/en/outdoor-cleaning-and-grounds-care/graffiti-removal/"],
  ["/en/professional-exterior-cleaning/janitor-service", "/en/outdoor-cleaning-and-grounds-care/groundskeeping/"],
  ["/en/professional-exterior-cleaning/leaf-removal", "/en/outdoor-cleaning-and-grounds-care/leaf-removal/"],
  ["/en/professional-exterior-cleaning/snow-clearing-in-tallinn-and-harju-county", "/en/outdoor-cleaning-and-grounds-care/snow-clearing/"],
  ["/en/professional-exterior-cleaning/lawn-mowing", "/en/outdoor-cleaning-and-grounds-care/lawn-mowing/"],
  ["/en/professional-exterior-cleaning/street-paving-washing", "/en/outdoor-cleaning-and-grounds-care/paving-stone-cleaning/"],
] as const;

const nextConfig: NextConfig = {
  trailingSlash: true,
  poweredByHeader: false,
  serverExternalPackages: ["sharp"],
  turbopack: {
    root: process.cwd(),
  },
  async redirects() {
    return [
      ...localizedLegacyRedirects.map(([source, destination]) => ({
        source,
        destination,
        permanent: true,
      })),
      {
        source: "/kontorikoristus",
        destination: "/koristusteenus/kontori-koristus/",
        permanent: true,
      },
      {
        source: "/kaubanduspindade-koristus",
        destination: "/koristusteenus/kaubanduspindade-koristus/",
        permanent: true,
      },
      {
        source: "/tootmishoonete-koristus",
        destination: "/koristusteenus/tootmishoonete-koristus/",
        permanent: true,
      },
      // Slug renames must come before the /valikoristus/:path* wildcard,
      // otherwise the wildcard forwards the wrong slug to a 404 target.
      {
        source: "/valikoristus/muru-niitmine",
        destination: "/koristusteenus/valikoristus/muruniitmine/",
        permanent: true,
      },
      {
        source: "/valikoristus/tanavakivi-pesu-ja-hooldus",
        destination: "/koristusteenus/valikoristus/tanavakivide-pesu-ja-hooldus/",
        permanent: true,
      },
      {
        source: "/valikoristus/:path*",
        destination: "/koristusteenus/valikoristus/:path*",
        permanent: true,
      },
      {
        source: "/blog/8-kusimust-enne-koristuslepingu-solmimist",
        destination: "/blog/kaheksa-kusimust-enne-koristuslepingu-solmimist/",
        permanent: true,
      },
      {
        source: "/en/blog",
        destination: "/blog/",
        permanent: true,
      },
      {
        source: "/en/blog/:path*",
        destination: "/blog/",
        permanent: true,
      },
      {
        source: "/ru/blog",
        destination: "/blog/",
        permanent: true,
      },
      {
        source: "/ru/blog/:path*",
        destination: "/blog/",
        permanent: true,
      },
      {
        source: "/remonditeenused-tallinnas/kojameheteenus",
        destination: "/koristusteenus/valikoristus/kojameheteenus/",
        permanent: true,
      },
      {
        source: "/remonditeenused-tallinnas/lehtedekoristamine",
        destination: "/koristusteenus/valikoristus/lehtedekoristamine/",
        permanent: true,
      },
      {
        source: "/remonditeenused-tallinnas/muruniitmine",
        destination: "/koristusteenus/valikoristus/muruniitmine/",
        permanent: true,
      },
      {
        source: "/remonditeenused-tallinnas/betoonitood",
        destination: "/remonditeenused-tallinnas/",
        permanent: true,
      },
      {
        source: "/en/repair-services-in-tallinn/concrete-works",
        destination: "/en/repair-services-in-tallinn/",
        permanent: true,
      },
      {
        source: "/remonditeenused-tallinnas/garderoobide-ehitus",
        destination: "/remonditeenused-tallinnas/",
        permanent: true,
      },
      {
        source: "/en/repair-services-in-tallinn/cloakroom-construction",
        destination: "/en/repair-services-in-tallinn/",
        permanent: true,
      },
      {
        source: "/kas-koristusfirma-tostab-hinda",
        destination: "/blog/miks-puhastusteenuste-hinnad-tousevad/",
        permanent: true,
      },
      {
        source: "/kodune-akende-pesu-kuidas-aknad-sarama-luua",
        destination: "/koristusteenus/valikoristus/akende-pesu/",
        permanent: true,
      },
      {
        source: "/koristusteenused",
        destination: "/koristusteenus/",
        permanent: true,
      },
      {
        source: "/koristusteenused/:path*",
        destination: "/koristusteenus/:path*",
        permanent: true,
      },
      {
        source: "/puhastusteenused/ehitusjargne-koristus-ja-puhastus",
        destination: "/puhastusteenused/ehitusjargne-koristus/",
        permanent: true,
      },
      {
        source: "/puhastusteenused/ehitusprahi-aravedu",
        destination: "/ehitusprahi-aravedu/",
        permanent: true,
      },
      {
        source: "/puhastusteenused/suitsukahjustuste-ja-tulekahjustuste-puhastamine",
        destination: "/puhastusteenused/suitsu-ja-tulekahjustuste-puhastamine/",
        permanent: true,
      },
      {
        source: "/remonditeenused-tallinnas/siseviimistlus",
        destination: "/remonditeenused-tallinnas/siseviimistlustood/",
        permanent: true,
      },
      {
        source: "/privaatsus",
        destination: "/andmekaitsetingimused/",
        permanent: true,
      },
      {
        source: "/koristusteenus/koolide-koristamine",
        destination: "/koolide-koristamine/",
        permanent: true,
      },
      {
        source: "/puhastusteenused/desinfitseerimine",
        destination: "/puhastusteenused/koroonaviiruse-jargne-puhastus/",
        permanent: true,
      },
      {
        source: "/remonditeenused-tallinnas/torutood-2",
        destination: "/remonditeenused-tallinnas/torutood/",
        permanent: true,
      },
      {
        source: "/puhastusteenused/pehme-moobli-puhastus",
        destination: "/puhastusteenused/",
        permanent: true,
      },
      {
        source: "/sps-grupp-partnerina",
        destination: "/sps-grupp/",
        permanent: true,
      },
      {
        source: "/sps-grupp-partnerina/meetodid/kvaliteedi-ja-keskkonnapoliitika",
        destination: "/sps-grupp/",
        permanent: true,
      },

      /* ---- Legacy URLs found in GSC (audit 2026-09-01) ---- */
      // Old contact/thank-you pages
      { source: "/herokontakt", destination: "/kontakt/", permanent: true },
      { source: "/tanan", destination: "/kontakt/", permanent: true },
      // Old duplicate about-page + removed /sps-grupp subpages
      // (NB: /sps-grupp/arvamused is a live page - redirect only dead children)
      { source: "/sps-grupp-2", destination: "/sps-grupp/", permanent: true },
      { source: "/sps-grupp/ettevotte-juhtimine", destination: "/sps-grupp/", permanent: true },
      { source: "/sps-grupp/iso-sertifikaadid", destination: "/sps-grupp/", permanent: true },
      { source: "/sps-grupp/koostoopartnerid", destination: "/sps-grupp/", permanent: true },
      { source: "/sps-grupp/kliendi-rahulolu", destination: "/sps-grupp/", permanent: true },
      { source: "/sps-grupp/kvaliteedi-ja-keskkonnapoliitika", destination: "/sps-grupp/", permanent: true },
      { source: "/sps-grupp/ressursijuhtimine", destination: "/sps-grupp/", permanent: true },
      { source: "/sps-grupp/toode-teostus", destination: "/sps-grupp/", permanent: true },
      // Old WP blog posts that lived at the root (migrated posts -> new /blog URL)
      { source: "/miks-teha-kodus-suurpuhastus", destination: "/blog/miks-teha-kodus-suurpuhastus/", permanent: true },
      { source: "/mis-on-koristusteenuse-proovitoo-ja-vastutuskindlustus", destination: "/blog/mis-on-koristusteenuse-proovitoo-ja-vastutuskindlustus/", permanent: true },
      { source: "/kas-prugi-sorteerimine-kontoris-on-voimalik", destination: "/blog/kas-prugi-sorteerimine-kontoris-on-voimalik/", permanent: true },
      { source: "/keskkonnasobralikud-puhastusvahendid", destination: "/blog/keskkonnasobralikud-puhastusvahendid/", permanent: true },
      { source: "/meie-tootaja-palk-olgu-korgem-tegevusala-keskmisest", destination: "/blog/meie-tootaja-palk-olgu-korgem-tegevusala-keskmisest/", permanent: true },
      { source: "/tipp-ja-tapp-koristusaris-eesti-ekspress-delfi", destination: "/blog/tipp-ja-tapp-koristusaris-eesti-ekspress-delfi/", permanent: true },
      { source: "/ise-koristada-pole-enam-moes-aripaev", destination: "/blog/ise-koristada-pole-enam-moes-aripaev/", permanent: true },
      { source: "/kes-on-maailma-kuulsamad-koristajad", destination: "/blog/kes-on-maailma-kuulsamad-koristajad/", permanent: true },
      { source: "/survepesu-mitmekulgne-abimees", destination: "/blog/kuidas-valida-survepesurit-ostujuhend/", permanent: true },
      { source: "/kontori-koristamisteenus-ahvardab-kallineda-aripaev", destination: "/blog/miks-puhastusteenuste-hinnad-tousevad/", permanent: true },
      { source: "/kas-tookeskonna-kvaliteet-ikka-mojutab-tootlikust", destination: "/blog/kas-puhas-kontor-vahendab-haiguspaevi-teadusuuringud/", permanent: true },
      { source: "/ara-astu-ambrisse-ehk-usaldusvaarse-koristusfirma-valimine", destination: "/blog/kaheksa-kusimust-enne-koristuslepingu-solmimist/", permanent: true },
      { source: "/puhastusvahendite-moju-tervisele-ja-allergiariskid", destination: "/blog/keskkonnasobralikud-puhastusvahendid/", permanent: true },
      // Old WP root posts whose closest match is a service page
      { source: "/kuidas-poranda-eest-oigesti-hoolt-kanda", destination: "/puhastusteenused/porandate-hooldus/", permanent: true },
      { source: "/kontori-puhastamine-ja-selle-olulisus", destination: "/koristusteenus/kontori-koristus/", permanent: true },
      { source: "/miks-tellida-ehitusjargne-koristus", destination: "/puhastusteenused/ehitusjargne-koristus/", permanent: true },
      { source: "/vaipade-puhastus-ettevottes", destination: "/puhastusteenused/vaipade-puhastus/", permanent: true },
      { source: "/puhastusteenused-teevad-tuju-roomsaks", destination: "/puhastusteenused/", permanent: true },
      { source: "/heakorra-terviklahendused", destination: "/koristusteenus/", permanent: true },
      // Old news items with no modern equivalent -> blog index
      { source: "/konkurentsivoimelisim-mikroettevote-2016", destination: "/sps-grupp/", permanent: true },
      { source: "/kas-on-pointi-koristajat-vahetada", destination: "/blog/", permanent: true },
      { source: "/kinnisvarahaldajate-top-ehitusuudised", destination: "/blog/", permanent: true },
      // WP taxonomy / feed artifacts -> blog index
      { source: "/category/:path*", destination: "/blog/", permanent: true },
      { source: "/uudised", destination: "/blog/", permanent: true },
      { source: "/uudised/:path*", destination: "/blog/", permanent: true },
      { source: "/feed", destination: "/blog/", permanent: true },
      { source: "/2025/10/17/akende-pesu-video", destination: "/blog/pese-aknad-ise-vs-professionaalne-teenus/", permanent: true },
      { source: "/2025/:path*", destination: "/blog/", permanent: true },
      // WP FAQ custom post types
      { source: "/faq-items/kui-palju-koristusteenused-maksavad", destination: "/koristusteenus/", permanent: true },
      { source: "/faq-items/kui-palju-puhastusteenused-maksavad", destination: "/puhastusteenused/", permanent: true },
      { source: "/faq-items/mida-koristusteenused-endas-sisaldavad", destination: "/koristusteenus/", permanent: true },
      { source: "/faq-items/kuidas-saab-sps-gruppi-usaldada-meie-pindasid-puhastama", destination: "/sps-grupp/", permanent: true },
      { source: "/faq-items/kui-meie-ettevottel-tekib-erisoove", destination: "/kontakt/", permanent: true },
      { source: "/faq_category/koristusteenused", destination: "/koristusteenus/", permanent: true },
      { source: "/faq_category/puhastusteenused", destination: "/puhastusteenused/", permanent: true },
      // Old job ad (position closed; active ads are dynamic pages and must not be shadowed)
      { source: "/eripuhastustoode-spetsialist", destination: "/tule-meile-toole/", permanent: true },
      // WP boilerplate/test pages
      { source: "/elementor-6122", destination: "/", permanent: true },
      { source: "/testing", destination: "/", permanent: true },
      { source: "/sps-404", destination: "/", permanent: true },
      // Old EN blog-category URLs (blog exists only in ET; map to the matching service)
      {
        source: "/en/professional-exterior-decoration-in-tallinn-territory-maintenance-sps-grupp/professional-facade-cleaning-adding-value-to-your-property",
        destination: "/en/outdoor-cleaning-and-grounds-care/facade-cleaning/",
        permanent: true,
      },
      {
        source: "/en/professional-exterior-decoration-in-tallinn-territory-maintenance-sps-grupp/professional-window-cleaning-in-tallinn-how-40-more-light-can-change-the-working-environment",
        destination: "/en/outdoor-cleaning-and-grounds-care/window-cleaning/",
        permanent: true,
      },
      {
        source: "/en/professional-exterior-decoration-in-tallinn-territory-maintenance-sps-grupp/street-paving-washing-and-maintenance-a-strategy-for-preserving-property-value",
        destination: "/en/outdoor-cleaning-and-grounds-care/paving-stone-cleaning/",
        permanent: true,
      },
      {
        source: "/en/professional-exterior-decoration-in-tallinn-territory-maintenance-sps-grupp/graffiti-removal-a-fast-and-professional-solution-for-roadside-buildings",
        destination: "/en/outdoor-cleaning-and-grounds-care/graffiti-removal/",
        permanent: true,
      },
      {
        source: "/en/professional-exterior-decoration-in-tallinn-territory-maintenance-sps-grupp",
        destination: "/en/outdoor-cleaning-and-grounds-care/",
        permanent: true,
      },
      {
        source: "/en/private-cleaning-services-for-business-clients-professional-cleaning-services-in-harjumaa-estonia/professional-floor-maintenance-in-tallinn-save-up-to-40-sps-grupp",
        destination: "/en/specialist-cleaning-services/floor-maintenance/",
        permanent: true,
      },
      {
        source: "/en/private-cleaning-services-for-business-clients-professional-cleaning-services-in-harjumaa-estonia/professional-carpet-cleaning-for-companies-in-tallinn-and-harju-county-how-to-ensure-a-clean-and-healthy-working-environment",
        destination: "/en/specialist-cleaning-services/carpet-cleaning/",
        permanent: true,
      },
      {
        source: "/en/private-cleaning-services-for-business-clients-professional-cleaning-services-in-harjumaa-estonia/smoke-and-fire-damage-cleaning",
        destination: "/en/specialist-cleaning-services/fire-and-smoke-damage-cleaning/",
        permanent: true,
      },
      {
        source: "/en/private-cleaning-services-for-business-clients-professional-cleaning-services-in-harjumaa-estonia",
        destination: "/en/cleaning-services-in-tallinn/",
        permanent: true,
      },
      {
        source: "/en/cleaning-services-for-business-clients/professional-carpet-cleaning-for-companies-in-tallinn-and-harju-county",
        destination: "/en/specialist-cleaning-services/carpet-cleaning/",
        permanent: true,
      },
      {
        source: "/en/professional-exterior-cleaning/street-paving-washing-and-maintenance",
        destination: "/en/outdoor-cleaning-and-grounds-care/paving-stone-cleaning/",
        permanent: true,
      },
      { source: "/en/removal-of-construction-waste", destination: "/en/construction-waste-removal/", permanent: true },
      {
        source: "/en/cleaning-services-in-tallinn/cleaning-up-retail-space-in-harjumaa-an-invisible-investment-that-brings-visible-results",
        destination: "/en/cleaning-services-in-tallinn/retail-cleaning/",
        permanent: true,
      },
      { source: "/en/sample-page", destination: "/en/", permanent: true },
      { source: "/en/category/:path*", destination: "/en/", permanent: true },
    ];
  },
};

export default nextConfig;
