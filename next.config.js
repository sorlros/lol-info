/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ddragon.leagueoflegends.com",
        port: "",
        pathname: "/cdn/**"
      },
      {
        protocol: "https",
        hostname: "raw.communitydragon.org",
        port: "",
        pathname: "/**"
      }
    ],
  }
};

module.exports = nextConfig;
