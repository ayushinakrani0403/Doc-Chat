// import type { NextConfig } from "next"

// const nextConfig: NextConfig = {
//   experimental: {
//     serverComponentsExternalPackages: ["bcryptjs"],
//   },
// }

// export default nextConfig
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // output: "standalone",
  serverExternalPackages: ["bcryptjs"],
}

export default nextConfig