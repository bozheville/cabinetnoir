import React, { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

import { GreatPrimer, Minion } from '@typography';
import { metal, engraved, focusRing } from '@theme/mixins';
import TextArea from '@molecues/TextArea/TextArea';
import { identify } from '@encryptors/shared/identification/identify';
import type { IdentificationResult } from '@encryptors/shared/identification/types';

import { IdentificationSection, Wrapper, Inner } from './elements';
import ResultsTree from './ResultsTree';
import MetricsPanel from './MetricsPanel';

// Cream text on the navy band.
const InputHeading = styled(GreatPrimer)`
  margin: 0;
  color: ${({ theme }) => theme.ink.cream};
`;

const Subtitle = styled(Minion)`
  color: ${({ theme }) => theme.ink.creamMuted};
`;

const UploadRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

// The .txt upload control: a brass plate button.
const UploadLabel = styled.label`
  display: inline-flex;
  align-items: center;
  padding: 0 16px;
  height: 36px;
  cursor: pointer;
  ${metal('brass')}
  ${engraved('metal')}
  font-size: 12px;
  ${focusRing}

  input {
    display: none;
  }
`;

const UploadError = styled(Minion)`
  color: ${({ theme }) => theme.ink.creamMuted};
`;

const Banner = styled(Minion)`
  padding: 10px 14px;
  border: 1px solid ${({ theme }) => theme.metal.copper.dark};
  border-radius: 2px;
  background: ${({ theme }) => theme.paper.parchment};
  color: ${({ theme }) => theme.ink.primary};
`;

// .txt upload: 100 KB is far beyond any hand cipher anyone will paste;
// larger files are refused with a message instead of being analysed.
const MAX_UPLOAD_BYTES = 100 * 1024;

// The cipher identification tool: paste a ciphertext, get a ranked tree
// of candidate families and ciphers. Analysis is deterministic and cheap
// enough to run on every keystroke.
const Identification: React.FC = () => {
  const { t } = useTranslation('common');
  const [input, setInput] = useState('');
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const result: IdentificationResult | null = useMemo(
    () => (input.trim() ? identify(input) : null),
    [input],
  );

  const handleFile = (file: File | undefined): void => {
    if (!file) {
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setUploadError(t('identify.uploadTooLarge'));
      return;
    }
    setUploadError('');
    file
      .text()
      .then((text) => {
        setInput(text);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      })
      .catch(() => setUploadError(t('identify.uploadFailed')));
  };

  return (
    <IdentificationSection stitch="both" zone="identify">
      <Wrapper>
        <Inner>
          <InputHeading>{t('identify.title')}</InputHeading>
          <Subtitle>{t('identify.subtitle')}</Subtitle>
          <TextArea
            value={input}
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setInput(event.target.value)}
            placeholder={t('identify.inputPlaceholder')}
            aria-label={t('identify.inputLabel')}
          />
          <UploadRow>
            <UploadLabel>
              {t('identify.upload')}
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,text/plain"
                onChange={(event) => handleFile(event.target.files?.[0])}
              />
            </UploadLabel>
            {uploadError && <UploadError>{uploadError}</UploadError>}
          </UploadRow>
          {result && result.tier === 'tooShort' && (
            <Banner>{t('identify.tooShort')}</Banner>
          )}
          {result && result.tier === 'unreliable' && (
            <Banner>
              {t('identify.unreliable', { letters: result.profile?.letterCount ?? '' })}
            </Banner>
          )}
          {result && result.tier !== 'tooShort' && (
            <>
              <ResultsTree result={result} input={input} />
              {result.profile && <MetricsPanel profile={result.profile} />}
            </>
          )}
        </Inner>
      </Wrapper>
    </IdentificationSection>
  );
};

Identification.displayName = 'Identification';

export default Identification;
