import type { NextConfig } from "next";
// Use CommonJS require since pwa.config.js exports module.exports
// eslint-disable-next-line @typescript-eslint/no-var-requires
const withPWA = require("./pwa.config.js");

const nextConfig: NextConfig = {
  // additional Next config here as needed
};

export default withPWA(nextConfig);
