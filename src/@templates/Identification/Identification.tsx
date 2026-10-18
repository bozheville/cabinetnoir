import React, { useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

import { GreatPrimer, Minion } from '@typography';
import TextArea from '@molecues/TextArea/TextArea';
import { identify } from '@encryptors/shared/identification/identify';
import type { IdentificationResult } from '@encryptors/shared/identification/types';

import { IdentificationSection, Wrapper, Inner } from './elements';

const InputHeading = styled(GreatPrimer)`
  margin: 0;
`;

// The cipher identification tool: paste a ciphertext, get a ranked tree
// of candidate families and ciphers. Analysis is deterministic and cheap
// enough to run on every keystroke.
const Identification: React.FC = () => {
  const { t } = useTranslation('common');
  const [input, setInput] = useState('');

  const result: IdentificationResult | null = useMemo(
    () => (input.trim() ? identify(input) : null),
    [input],
  );

  return (
    <IdentificationSection stitch="both" color="description">
      <Wrapper>
        <Inner>
          <InputHeading>{t('identify.title')}</InputHeading>
          <Minion>{t('identify.subtitle')}</Minion>
          <TextArea
            value={input}
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setInput(event.target.value)}
            placeholder={t('identify.inputPlaceholder')}
            aria-label={t('identify.inputLabel')}
          />
          {result && result.tier !== 'tooShort' && (
            <div>
              {result.families.map((family) => (
                <div key={family.family}>
                  <GreatPrimer>{t(`identify.families.${family.family}`)} — {family.score}</GreatPrimer>
                  {family.ciphers.map((cipher) => (
                    <Minion key={cipher.id}>
                      {t(`identify.ciphers.${cipher.id}`)}: {cipher.confidence} ({cipher.score})
                    </Minion>
                  ))}
                </div>
              ))}
            </div>
          )}
        </Inner>
      </Wrapper>
    </IdentificationSection>
  );
};

Identification.displayName = 'Identification';

export default Identification;
