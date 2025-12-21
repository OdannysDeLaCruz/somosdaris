import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 // Solo necesario en desarrollo, no aplica en producción
    ...(process.env.NODE_ENV === 'development' && {
      allowedDevOrigins: [
        '192.168.1.42',
        'localhost',
      ],
    }),
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**',
        },
        {
          protocol: 'http',
          hostname: '**',
        },
      ],
    },
};

export default nextConfig;
