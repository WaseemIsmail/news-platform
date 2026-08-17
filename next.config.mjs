import path from "node:path";
import { fileURLToPath } from "node:url";
import os from "node:os";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const localNetworkAddresses = Object.values(os.networkInterfaces())
  .flat()
  .filter((network) => network && !network.internal && (network.family === "IPv4" || network.family === 4))
  .map((network) => network.address);

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: projectRoot,
  },
  // Allow phones on this computer's current Wi-Fi/LAN addresses to receive
  // development scripts and hot updates. Unrelated origins remain blocked.
  allowedDevOrigins: localNetworkAddresses,
};

export default nextConfig;
