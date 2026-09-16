const path = require('path');
const { i18n } = require('./next-i18next.config')
const { initOpenNextCloudflareForDev } = require('@opennextjs/cloudflare');

module.exports = {
  i18n,
  outputFileTracingRoot: path.join(__dirname),
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });

    return config;
  },
}

initOpenNextCloudflareForDev();
