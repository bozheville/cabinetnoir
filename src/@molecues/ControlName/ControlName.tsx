import React from 'react';
import { useTranslation } from 'next-i18next';

interface ControlNameProps {
  id: string;
}

// The translated name of a tool control, for use inside guide steps. The
// ids double as data-guide attributes on the controls themselves, which
// the interactive tour (later task) targets.
const ControlName: React.FC<ControlNameProps> = ({ id }) => {
  const { t } = useTranslation('common');
  const name = t(`learning.controls.${id}`);

  if (name.startsWith('learning.controls.')) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[guide] unknown control id: ${id}`);
    }
    return null;
  }

  return <strong>{name}</strong>;
};

ControlName.displayName = 'ControlName';

export default ControlName;
