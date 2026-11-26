module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr', 'ua'],
  },
  // Locale parity (scripts/locale_parity.py) guarantees every key exists in
  // every locale, so fr/ua pages need no `en` fallback bundle serialized
  // into __NEXT_DATA__ (~120KB per page).
  fallbackLng: false,
}
