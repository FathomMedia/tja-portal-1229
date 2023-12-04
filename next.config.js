const withNextIntl = require("next-intl/plugin")();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["i.pinimg.com", "images.unsplash.com"],
  },
};

module.exports = withNextIntl(nextConfig);
