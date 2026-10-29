const path = require('path');
const { i18n } = require('./next-i18next.config')
const { initOpenNextCloudflareForDev } = require('@opennextjs/cloudflare');

module.exports = {
  i18n,
  outputFileTracingRoot: path.join(__dirname),
  // Deterministic styled-components class names, so SSR and client match.
  compiler: {
    styledComponents: true,
  },
  // Next 16 builds with Turbopack by default; the webpack() hook below is
  // only used with the explicit --webpack opt-out.
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });

    return config;
  },
}

initOpenNextCloudflareForDev();
