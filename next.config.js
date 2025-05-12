/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
  output: 'standalone',
  images: {
    domains: ['images.unsplash.com'],
    unoptimized: true,
  },
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't attempt to load these modules on the client side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: 'empty',
        tls: 'empty',
        fs: 'empty',
        dns: 'empty',
        child_process: 'empty',
        crypto: 'empty',
        stream: 'empty',
        http: 'empty',
        https: 'empty',
        zlib: 'empty',
        path: 'empty',
        os: 'empty',
        util: 'empty',
        buffer: 'empty',
        url: 'empty',
        assert: 'empty',
        constants: 'empty',
        timers: 'empty',
        'mongodb-client-encryption': 'empty',
        'mongodb-oidc': 'empty',
      };
      
      // Add rules to ignore MongoDB client-side encryption modules
      config.module.rules.push(
        {
          test: /mongodb-client-encryption|mongodb-oidc/,
          use: 'null-loader',
        }
      );
    }
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, 'src'),
    };
    config.externals = [
      ...(config.externals || []),
      { 'tailwind-merge': 'tailwind-merge' },
      {
        'mongodb': 'commonjs mongodb',
        '@auth/mongodb-adapter': 'commonjs @auth/mongodb-adapter',
      },
    ];
    return config;
  },
};

module.exports = nextConfig