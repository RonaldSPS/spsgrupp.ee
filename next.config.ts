import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
        source: "/valikoristus",
        destination: "/koristusteenus/valikoristus",
        permanent: true,
      },
      {
        source: "/valikoristus/akende-pesu",
        destination: "/koristusteenus/valikoristus/akende-pesu",
        permanent: true,
      },
      {
        source: "/valikoristus/tanavakivide-pesu-ja-hooldus",
        destination: "/koristusteenus/valikoristus/tanavakivide-pesu-ja-hooldus",
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
        source: "/blog/8-kusimust-enne-koristuslepingu-solmimist",
        destination: "/blog/kaheksa-kusimust-enne-koristuslepingu-solmimist",
        permanent: true,
      },
      {
        source: "/valikoristus/lumekoristus",
        destination: "/koristusteenus/valikoristus/lumekoristus",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
