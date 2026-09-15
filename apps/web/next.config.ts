import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Standalone output traces only the files actually needed at runtime,
  // making the production Docker image far smaller than shipping the
  // whole node_modules tree.
  output: "standalone",
  // Required for monorepos: without this, file tracing may not correctly
  // walk up to the workspace root to resolve hoisted dependencies.
  outputFileTracingRoot: path.join(__dirname, "../../"),
};

export default nextConfig;
