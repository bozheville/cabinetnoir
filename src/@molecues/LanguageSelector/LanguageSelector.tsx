import React from 'react';
import { Select } from '@atoms';
import { useRouter } from 'next/router';

const LOCALES = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
  { value: 'ua', label: 'Українська' },
];

const LanguageSelector: React.FC = () => {
  const router = useRouter();

  const handleChangeLocale = (event) => {
    router.push(router.asPath, undefined, {
      locale: event.target.value,
    });
  };

  return (
    <Select
      onChange={handleChangeLocale}
      defaultValue={router.locale}
      options={LOCALES}
      width="200px"
      aria-label="Language"
    />
  );
};

LanguageSelector.displayName = 'LanguageSelector';

export default LanguageSelector;
