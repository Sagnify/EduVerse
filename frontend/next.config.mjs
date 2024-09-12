/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ibb.co",
        pathname: `/*/*`,
      },
    ],
  },
  i18n: {
    locales: ["en", "hi"], // Add the languages you want to support
    defaultLocale: "en", // Default language
    localeDetection: true, // Detect the user's preferred language automatically
  },
};

export default nextConfig;
