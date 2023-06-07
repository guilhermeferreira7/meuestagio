module.exports = {
  webpack: (config, { dev }) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    return config;
  },
  pageExtensions: ["page.tsx"],
};
