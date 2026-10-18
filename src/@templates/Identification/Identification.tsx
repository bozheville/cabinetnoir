import React, { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

import { GreatPrimer, Minion } from '@typography';
import TextArea from '@molecues/TextArea/TextArea';
import { identify } from '@encryptors/shared/identification/identify';
import type { IdentificationResult } from '@encryptors/shared/identification/types';

import { IdentificationSection, Wrapper, Inner } from './elements';
import ResultsTree from './ResultsTree';
import MetricsPanel from './MetricsPanel';

const InputHeading = styled(GreatPrimer)`
  margin: 0;
`;

const UploadRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const UploadLabel = styled.label`
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colorScheme.blue[500]};
  color: ${({ theme }) => theme.colorScheme.blue[600]};
  font-size: 13px;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colorScheme.blue[100]};
  }

  input {
    display: none;
  }
`;

const Banner = styled(Minion)`
  padding: 10px 14px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colorScheme.orange[500]};
  background: ${({ theme }) => theme.colorScheme.orange[100]};
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
            {uploadError && <Minion>{uploadError}</Minion>}
          </UploadRow>
          {result && result.tier === 'tooShort' && (
            <Banner>{t('identify.tooShort')}</Banner>
          )}
          {result && result.tier === 'unreliable' && (
            <Banner>{t('identify.unreliable')}</Banner>
          )}
          {result && result.tier !== 'tooShort' && (
            <>
              <ResultsTree result={result} />
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
