import type { NextConfig } from "next";

function supabaseHostname() {
  const value = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!value) return null;

  try {
    return new URL(value).hostname;
  } catch {
    return null;
  }
}

const hostname = supabaseHostname();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: hostname
      ? [
          {
            protocol: "https",
            hostname,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },
};

export default nextConfig;
