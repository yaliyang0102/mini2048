/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // 客户端构建时排除Node.js和React Native模块
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        '@react-native-async-storage/async-storage': false,
        'pino-pretty': false,
      };
    }

    config.externals.push(
      'pino-pretty',
      'lokijs',
      'encoding',
      'thread-stream',
      '@react-native-async-storage/async-storage'
    );

    return config;
  },
  
  // ✅ 移除过时的配置项
  // experimental: {
  //   appDir: true, // 已不需要，App Router在14.x中已稳定
  // },
  // serverExternalPackages: [], // 不存在的配置项
  
  // ✅ 如需排除服务器端包，使用正确的实验性选项
  experimental: {
    serverComponentsExternalPackages: [
      'pino',
      'pino-pretty',
      '@walletconnect/logger',
    ],
  },
};

module.exports = nextConfig;
