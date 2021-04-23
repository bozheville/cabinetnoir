import React from 'react';
import { Select } from 'evergreen-ui';
import { useRouter } from 'next/router';

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
      maxWidth="200px"
    >
      <option value="en">English</option>
      <option value="fr">Français</option>
      <option value="ua">Українська</option>
    </Select>
  );
};

LanguageSelector.displayName = 'LanguageSelector';

export default LanguageSelector;
