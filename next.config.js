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
