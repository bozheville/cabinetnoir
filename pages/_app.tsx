import React from 'react';
import { appWithTranslation } from 'next-i18next';
import { RecentlyUsedContext, useRecentlyUsedContext } from '@contexts';

import '../styles/globals.css';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import theme from '@theme';

const vars = (obj: Record<string, string>) =>
  Object.entries(obj)
    .map(([k, v]) => `--${k}: ${v};`)
    .join('\n');

const varsByGroup = (name: string, group: Record<string, { base: string } | string>) =>
  Object.entries(group)
    .map(([k, v]) => `--${name}-${k}: ${typeof v === 'string' ? v : v.base};`)
    .join('\n');

const GlobalCSS = createGlobalStyle`
:root {
  /* CSS variables mirror the JS theme; both come from src/@theme. */
  ${varsByGroup('leather', theme.leather)}
  ${varsByGroup('metal', theme.metal)}
  ${varsByGroup('paper', theme.paper)}
  ${varsByGroup('ink', theme.ink)}
  ${varsByGroup('thread', theme.thread)}
  ${varsByGroup('desk', theme.desk)}
  --brass-gradient: linear-gradient(180deg, ${theme.metal.brass.highlight} 0%, ${theme.metal.brass.light} 18%, ${theme.metal.brass.base} 55%, ${theme.metal.brass.dark} 100%);
  --copper-gradient: linear-gradient(180deg, ${theme.metal.copper.highlight} 0%, ${theme.metal.copper.light} 18%, ${theme.metal.copper.base} 55%, ${theme.metal.copper.dark} 100%);
}

@font-face {
  font-family: "Roboto";
  src: url("/fonts/Roboto/Roboto-Regular.ttf");
  font-style: normal;
  font-weight: 400;
  font-display: swap;
}

@font-face {
  font-family: "Roboto";
  src: url("/fonts/Roboto/Roboto-Medium.ttf");
  font-style: normal;
  font-weight: 500;
  font-display: swap;
}

@font-face {
  font-family: "Roboto";
  src: url("/fonts/Roboto/Roboto-Bold.ttf");
  font-style: normal;
  font-weight: 700;
  font-display: swap;
}

@font-face {
  font-family: "Roboto";
  src: url("/fonts/Roboto/Roboto-Black.ttf");
  font-style: normal;
  font-weight: 900;
  font-display: swap;
}

@font-face {
  font-family: "Roboto-Slab";
  src: url("/fonts/Roboto_Slab/static/RobotoSlab-Regular.ttf");
  font-style: normal;
  font-weight: 400;
  font-display: swap;
}

body {
  /* Desk: patchwork of three close dark tones under the grain. */
  background-color: ${theme.desk.espresso};
  background-image: url(/images/grain.png), url(/images/desk-patchwork.svg);
  background-size: auto, 960px 720px;
  background-blend-mode: multiply, normal;
  background-attachment: scroll;
  color: ${theme.ink.primary};
}

@media (max-width: 640px) {
  body { background-size: auto, 640px 480px; }
}

@media (forced-colors: active) {
  body { background-image: none; }
}

/* Mechanical, short motion only. Nothing loops. */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}

/* Print: strip leather, metal and ornaments. Paper is white, ink is
   black, text areas print their content (spec 08 "Print"). Chrome
   (header, footer, tabs) hides itself in its own print rules. */
@media print {
  body {
    background: white;
    color: black;
  }

  * {
    background-image: none !important;
    box-shadow: none !important;
    text-shadow: none !important;
  }
}
`;

const MyApp = ({ Component, pageProps }) => {
  return (
    <ThemeProvider theme={theme}>
      <RecentlyUsedContext.Provider value={useRecentlyUsedContext()}>
        <GlobalCSS />
        <Component {...pageProps} />
      </RecentlyUsedContext.Provider>
    </ThemeProvider>
  );
};

export default appWithTranslation(MyApp);
