/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ddragon.leagueoflegends.com",
        port: "",
        pathname: "/cdn/14.10.1/img/profileicon/**"
      },
    ],
  }
};

export default nextConfig;
