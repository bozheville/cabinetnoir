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
    resolveAlias: {
      // evergreen-ui's toaster singleton runs ReactDOM.render at import
      // time (removed in React 19), in every version up to 7.1.9. The
      // app never calls the toaster, so alias it to a no-op stub. Nothing
      // in the app imports it directly, so the stub is safe in production
      // too (prod tree-shakes it away either way).
      'evergreen-ui/esm/toaster': './evergreen-toaster.dev-stub.js',
      'evergreen-ui/esm/toaster/src/index.js': './evergreen-toaster.dev-stub.js',
      'evergreen-ui/esm/toaster/src/Toaster.js': './evergreen-toaster.dev-stub.js',
    },
  },
  webpack(config, { dev }) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });

    if (dev) {
      // The toaster singleton runs ReactDOM.render at import time (React 19
      // removed it). Prod tree-shakes it away; dev keeps the barrel, so alias
      // the real module files to a no-op stub.
      const stub = path.join(__dirname, 'evergreen-toaster.dev-stub.js');
      config.resolve.alias[path.join(__dirname, 'node_modules/evergreen-ui/esm/toaster')] = stub;
      config.resolve.alias[path.join(__dirname, 'node_modules/evergreen-ui/esm/toaster/src/index.js')] = stub;
      config.resolve.alias[path.join(__dirname, 'node_modules/evergreen-ui/esm/toaster/src/Toaster.js')] = stub;
    }

    return config;
  },
}

initOpenNextCloudflareForDev();
