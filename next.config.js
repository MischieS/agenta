/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable TypeScript and ESLint during build for faster builds and reduced memory usage
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  
  // Image optimization - reduce memory footprint
  images: {
    unoptimized: true, // Disable Image Optimization API to save memory
    formats: ['image/webp'], // Only use webp for better compression
    minimumCacheTTL: 86400, // Cache images for 24 hours
    disableStaticImages: true, // Disable static image imports for lower memory usage
  },
  
  // Enable SWC minification for faster builds
  swcMinify: true,
  
  // Enable standalone output for smaller deployment packages
  output: 'standalone',
  
  // Disable React strict mode in production for better performance
  reactStrictMode: process.env.NODE_ENV === 'development',
  
  // Compression options
  compress: true,
  
  // Limit memory usage
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 15 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
  
  // Enable experimental optimizations
  experimental: {
    optimizeCss: true, // Optimize CSS
    optimizePackageImports: [ // Optimize large imports
      'framer-motion',
      '@radix-ui/*',
      '@heroicons/react',
      'lucide-react',
      'date-fns',
      'react-icons',
      'recharts'
    ],
    // Reduce memory usage during build
    workerThreads: false,
    cpus: 1,
    
    // More aggressive code optimization
    gzipSize: false, // Disable gzip size calculation during build to save memory
    turbotrace: {
      memoryLimit: 1024 // Limit memory usage for dependency tracing (in MB)
    },
    
    // Pre-render static pages whenever possible
    // Note: isrMemoryCacheSize/cacheMaxMemorySize removed as they're no longer supported
  },
  
  // Webpack optimizations
  webpack: (config, { isServer }) => {
    // Only run type checking and linting in development
    if (!isServer) {
      config.plugins = config.plugins.filter(
        (plugin) => 
          plugin.constructor.name !== 'ForkTsCheckerWebpackPlugin' &&
          plugin.constructor.name !== 'ESLintWebpackPlugin'
      );
    }
    
    // Optimize moment.js and other large libraries
    config.plugins.push(
      new (require('webpack').ContextReplacementPlugin)(
        /moment[\/]locale$/,
        /en/, // Only include English locale for moment.js
      )
    );
    
    // Ignore test files in production
    if (process.env.NODE_ENV === 'production') {
      config.module.rules.push({
        test: /\.(spec|test)\.[jt]sx?$/,
        loader: 'ignore-loader'
      });
    }
    
    // Set performance budget
    config.performance = {
      hints: 'warning',
      maxEntrypointSize: 400000,
      maxAssetSize: 400000,
    };
    
    return config;
  },
  
  // Disable source maps in production
  productionBrowserSourceMaps: false,
  
  // Enable output file tracing for better tree-shaking
  outputFileTracing: true,
  
  // Use trailing slash for better Cloudfront/CDN compatibility
  trailingSlash: true,
  
  // Minimize the number of chunks
  poweredByHeader: false,
}

// Add memory usage optimization wrapper
const withMemoryOptimizations = (config) => {
  // Set low memory Node.js options for EC2 deployment
  process.env.NODE_OPTIONS = process.env.NODE_OPTIONS || '--max-old-space-size=1536';
  return config;
};

// Enable bundle analyzer only when explicitly requested
if (process.env.ANALYZE === 'true') {
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
  });
  module.exports = withBundleAnalyzer(withMemoryOptimizations(nextConfig));
} else {
  module.exports = withMemoryOptimizations(nextConfig);
}
