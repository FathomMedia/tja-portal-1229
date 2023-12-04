const withNextIntl = require("next-intl/plugin")();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["i.pinimg.com", "images.unsplash.com", "i.ytimg.com"],
  },
};

module.exports = withNextIntl(nextConfig);
