import type { NextConfig } from "next";

require('dotenv').config();

module.exports = {
    env: {
        OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    },
};

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
