import type { NextConfig } from "next";

const localizedLegacyRedirects = [
  ["/en/cleaning-services-in-tallinn/cleaning-up-retail-spaces", "/en/cleaning-services-in-tallinn/retail-cleaning"],
  ["/en/cleaning-services-in-tallinn/cleaning-of-industrial-buildings", "/en/cleaning-services-in-tallinn/industrial-cleaning"],
  ["/en/cleaning-services-for-business-clients", "/en/specialist-cleaning-services"],
  ["/en/cleaning-services-for-business-clients/post-construction-cleaning", "/en/specialist-cleaning-services/post-construction-cleaning"],
  ["/en/cleaning-services-for-business-clients/deep-cleaning-of-escalators", "/en/specialist-cleaning-services/escalator-deep-cleaning"],
  ["/en/cleaning-services-for-business-clients/disinfection-and-post-virus-cleaning", "/en/specialist-cleaning-services/disinfection"],
  ["/en/cleaning-services-for-business-clients/professional-floor-maintenance-in-tallinn", "/en/specialist-cleaning-services/floor-maintenance"],
  ["/en/cleaning-services-for-business-clients/smoke-and-fire-damage-cleaning", "/en/specialist-cleaning-services/fire-and-smoke-damage-cleaning"],
  ["/en/cleaning-services-for-business-clients/carpet-cleaning", "/en/specialist-cleaning-services/carpet-cleaning"],
  ["/en/repair-services-in-tallinn/plating", "/en/repair-services-in-tallinn/tiling"],
  ["/en/repair-services-in-tallinn/sanitary-renovation-and-conversion", "/en/repair-services-in-tallinn/washroom-renovation"],
  ["/en/repair-services-in-tallinn/pipeworks", "/en/repair-services-in-tallinn/plumbing"],
  ["/en/repair-services-in-tallinn/construction-and-maintenance-of-ventilation-systems", "/en/repair-services-in-tallinn/ventilation-installation-and-maintenance"],
  ["/en/professional-exterior-cleaning", "/en/outdoor-cleaning-and-grounds-care"],
  ["/en/professional-exterior-cleaning/professional-window-cleaning-in-tallinn", "/en/outdoor-cleaning-and-grounds-care/window-cleaning"],
  ["/en/professional-exterior-cleaning/professional-facade-cleaning", "/en/outdoor-cleaning-and-grounds-care/facade-cleaning"],
  ["/en/professional-exterior-cleaning/graffiti-removal", "/en/outdoor-cleaning-and-grounds-care/graffiti-removal"],
  ["/en/professional-exterior-cleaning/janitor-service", "/en/outdoor-cleaning-and-grounds-care/groundskeeping"],
  ["/en/professional-exterior-cleaning/leaf-removal", "/en/outdoor-cleaning-and-grounds-care/leaf-removal"],
  ["/en/professional-exterior-cleaning/snow-clearing-in-tallinn-and-harju-county", "/en/outdoor-cleaning-and-grounds-care/snow-clearing"],
  ["/en/professional-exterior-cleaning/lawn-mowing", "/en/outdoor-cleaning-and-grounds-care/lawn-mowing"],
  ["/en/professional-exterior-cleaning/street-paving-washing", "/en/outdoor-cleaning-and-grounds-care/paving-stone-cleaning"],
  ["/ru/частные-клининговые-услуги-для-бизне", "/ru/клининговые-услуги-для-бизнеса"],
  ["/ru/частные-клининговые-услуги-для-бизне/послестроительная-уборка-в-харьюмаа", "/ru/клининговые-услуги-для-бизнеса/послестроительная-уборка"],
  ["/ru/частные-клининговые-услуги-для-бизне/глубокая-очистка-эскалаторов", "/ru/клининговые-услуги-для-бизнеса/глубокая-чистка-эскалаторов"],
  ["/ru/частные-клининговые-услуги-для-бизне/дезинфекция-и-очистка-после-вирусов", "/ru/клининговые-услуги-для-бизнеса/дезинфекция"],
  ["/ru/частные-клининговые-услуги-для-бизне/профессиональный-уход-за-полом-в-талл", "/ru/клининговые-услуги-для-бизнеса/уход-за-полами"],
  ["/ru/частные-клининговые-услуги-для-бизне/уборка-повреждений-от-дыма-и-огня", "/ru/клининговые-услуги-для-бизнеса/уборка-после-пожара"],
  ["/ru/частные-клининговые-услуги-для-бизне/профессиональная-чистка-ковров-для-к", "/ru/клининговые-услуги-для-бизнеса/чистка-ковров"],
  ["/ru/услуги-по-ремонту-в-таллинне/покрытие", "/ru/услуги-по-ремонту-в-таллинне/укладка-плитки"],
  ["/ru/услуги-по-ремонту-в-таллинне/обновление-и-преобразование-санитар", "/ru/услуги-по-ремонту-в-таллинне/ремонт-санузлов"],
  ["/ru/услуги-по-ремонту-в-таллинне/pipeworks", "/ru/услуги-по-ремонту-в-таллинне/сантехнические-работы"],
  ["/ru/услуги-по-ремонту-в-таллинне/строительство-и-обслуживание-вентил", "/ru/услуги-по-ремонту-в-таллинне/монтаж-и-обслуживание-вентиляции"],
  ["/ru/профессиональная-внешняя-отделка-в-т", "/ru/уборка-и-обслуживание-территорий"],
  ["/ru/профессиональная-внешняя-отделка-в-т/mытьe-окон", "/ru/уборка-и-обслуживание-территорий/мойка-окон"],
  ["/ru/профессиональная-внешняя-отделка-в-т/профессиональная-чистка-фасадов-пов", "/ru/уборка-и-обслуживание-территорий/мойка-фасадов"],
  ["/ru/профессиональная-внешняя-отделка-в-т/удаление-граффити-быстрое-и-професси", "/ru/уборка-и-обслуживание-территорий/удаление-граффити"],
  ["/ru/профессиональная-внешняя-отделка-в-т/услуги-дворника", "/ru/уборка-и-обслуживание-территорий/услуги-дворника"],
  ["/ru/профессиональная-внешняя-отделка-в-т/уборка-листьев", "/ru/уборка-и-обслуживание-территорий/уборка-листьев"],
  ["/ru/профессиональная-внешняя-отделка-в-т/уборка-снега-в-таллинне-и-харьюмаа", "/ru/уборка-и-обслуживание-территорий/уборка-снега"],
  ["/ru/профессиональная-внешняя-отделка-в-т/стрижка-газонов", "/ru/уборка-и-обслуживание-территорий/стрижка-газонов"],
  ["/ru/профессиональная-внешняя-отделка-в-т/мойка-и-уход-за-уличной-брусчаткой-стр", "/ru/уборка-и-обслуживание-территорий/мойка-тротуарной-плитки"],
] as const;

const nextConfig: NextConfig = {
  trailingSlash: true,
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
        destination: "/koristusteenus/kontori-koristus",
        permanent: true,
      },
      {
        source: "/kaubanduspindade-koristus",
        destination: "/koristusteenus/kaubanduspindade-koristus",
        permanent: true,
      },
      {
        source: "/tootmishoonete-koristus",
        destination: "/koristusteenus/tootmishoonete-koristus",
        permanent: true,
      },
      {
        source: "/valikoristus/:path*",
        destination: "/koristusteenus/valikoristus/:path*",
        permanent: true,
      },
      {
        source: "/blog/8-kusimust-enne-koristuslepingu-solmimist",
        destination: "/blog/kaheksa-kusimust-enne-koristuslepingu-solmimist",
        permanent: true,
      },
      {
        source: "/en/blog",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/en/blog/:path*",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/ru/blog",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/ru/blog/:path*",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/remonditeenused-tallinnas/kojameheteenus",
        destination: "/koristusteenus/valikoristus/kojameheteenus",
        permanent: true,
      },
      {
        source: "/remonditeenused-tallinnas/lehtedekoristamine",
        destination: "/koristusteenus/valikoristus/lehtedekoristamine",
        permanent: true,
      },
      {
        source: "/remonditeenused-tallinnas/muruniitmine",
        destination: "/koristusteenus/valikoristus/muruniitmine",
        permanent: true,
      },
      {
        source: "/remonditeenused-tallinnas/betoonitood",
        destination: "/remonditeenused-tallinnas",
        permanent: true,
      },
      {
        source: "/en/repair-services-in-tallinn/concrete-works",
        destination: "/en/repair-services-in-tallinn",
        permanent: true,
      },
      {
        source: "/remonditeenused-tallinnas/garderoobide-ehitus",
        destination: "/remonditeenused-tallinnas",
        permanent: true,
      },
      {
        source: "/en/repair-services-in-tallinn/cloakroom-construction",
        destination: "/en/repair-services-in-tallinn",
        permanent: true,
      },
      {
        source: "/kas-koristusfirma-tostab-hinda",
        destination: "/blog/miks-puhastusteenuste-hinnad-tousevad",
        permanent: true,
      },
      {
        source: "/kodune-akende-pesu-kuidas-aknad-sarama-luua",
        destination: "/koristusteenus/valikoristus/akende-pesu",
        permanent: true,
      },
      {
        source: "/koristusteenused",
        destination: "/koristusteenus",
        permanent: true,
      },
      {
        source: "/puhastusteenused/ehitusjargne-koristus-ja-puhastus",
        destination: "/puhastusteenused/ehitusjargne-koristus",
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
        destination: "/puhastusteenused",
        permanent: true,
      },
      {
        source: "/sps-grupp-partnerina",
        destination: "/sps-grupp",
        permanent: true,
      },
      {
        source: "/sps-grupp-partnerina/meetodid/kvaliteedi-ja-keskkonnapoliitika",
        destination: "/sps-grupp",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
