/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  webpack: (config, { isServer }) => {
    // 客户端构建时排除Node.js和React Native模块
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        '@react-native-async-storage/async-storage': false, // ✅ 排除RN存储
        'pino-pretty': false, // ✅ 排除Pino格式化工具
      };
    }

    // 将这些模块标记为外部依赖，避免打包
    config.externals.push(
      'pino-pretty',
      'lokijs',
      'encoding',
      'thread-stream',
      '@react-native-async-storage/async-storage'
    );

    return config;
  },
  
  // Next.js 14专用：标记服务器外部包
  serverExternalPackages: [
    'pino',
    'pino-pretty', 
    'thread-stream',
    '@walletconnect/logger',
  ],
};

module.exports = nextConfig;
