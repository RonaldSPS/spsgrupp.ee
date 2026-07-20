import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  serverExternalPackages: ["sharp"],
  turbopack: {
    root: process.cwd(),
  },
  async redirects() {
    return [
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
        source: "/valikoristus/lumekoristus",
        destination: "/koristusteenus/valikoristus/lumekoristus",
        permanent: true,
      },
      {
        source: "/blog/8-kusimust-enne-koristuslepingu-solmimist",
        destination: "/blog/kaheksa-kusimust-enne-koristuslepingu-solmimist",
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
      // valikoristus redirects removed — pages live at /koristusteenus/valikoristus/...
      // catch-all handles legacy /valikoristus/* URLs via page-registry
      {
        source: "/puhastusteenused/desinfitseerimine",
        destination: "/puhastusteenused/koroonaviiruse-jargne-puhastus/",
        permanent: true,
      },
      {
        source: "/remonditeenused-tallinnas/torutood",
        destination: "/remonditeenused-tallinnas/torutood-2/",
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
