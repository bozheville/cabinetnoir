import React, { useEffect, useContext } from 'react';
import Tooltip from '@atoms/Tooltip';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useTranslation } from 'next-i18next';

import { IconButton } from '@atoms';
import { SwapIcon } from '@ornaments';
import { ControlPanel } from '@organisms/ControlPanel';

import {
  Affine,
  Alberti,
  Atbash,
  Caesar,
  Polybius,
  Keyword,
  Columnar,
  RailFence,
  Enigma,
  Morse,
  Pigpen,
  Playfair,
  Vigenere,
  Beaufort,
  Autokey,
  Nihilist,
  Adfgvx,
  Saknussemm,
  encodingsList,
  encryptorsList,
  Base64,
  Rot13,
} from '@encryptors';
import { EcryptionSelector } from '@molecues';
import { RecentlyUsedContext } from '@contexts';

const DirectionRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
`;

const DirectionLabel = styled.span`
  width: 100%;
  font-family: ${({ theme }) => theme.type.engraved};
  font-weight: 500;
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.metal.brass.light};
  text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.6);
`;

// Engraved groove instead of the old #999 divider: a dark cut line
// with a faint light catch below it.
const Groove = styled.div`
  border-top: 1px solid ${({ theme }) => theme.metal.brass.shadow};
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

const SettingsRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

interface EncryptionSettingsProps {
  input: string;
  onOutputUpdate: (props: {output: string }) => void;
  // Panes that edit the input themselves (pigpen's glyph keyboard).
  onInputChange?: (value: string) => void;
  // Panes with their own key variants (pigpen) report them upward so
  // the output side can render accordingly.
  onVariantChange?: (variant: string) => void;
}

const EncryptionSettings: React.FC<EncryptionSettingsProps> = ({
  input,
  onOutputUpdate,
  onInputChange,
  onVariantChange,
}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { addRecentluUsed } = useContext(RecentlyUsedContext);
  const { algorithm, action } = router.query;

  const isDecryptMode = action === 'reverse';

  useEffect(() => {
    if (![...encodingsList, ...encryptorsList].includes(algorithm as string)) {
      router.push(`/`, undefined, { shallow: true });
    } else {
      addRecentluUsed(algorithm as string);
    }
  }, [algorithm]);


  const handleSwapMode = () => {
    router.push(
      `/encoder/${algorithm}/${isDecryptMode ? 'direct' : 'reverse'}`,
      undefined,
      {
        shallow: true
      }
    );
  };

  const EncryptionComponent =
    algorithm === 'affine' ? Affine :
    algorithm === 'alberti' ? Alberti :
    algorithm === 'atbash' ? Atbash :
    algorithm === 'base64' ? Base64 :
    algorithm === 'caesar' ? Caesar :
  algorithm === 'polybius' ? Polybius :
  algorithm === 'keyword' ? Keyword :
  algorithm === 'columnar' ? Columnar :
  algorithm === 'railFence' ? RailFence :
    algorithm === 'enigma' ? Enigma :
    algorithm === 'playfair' ? Playfair :
    algorithm === 'vigenere' ? Vigenere :
    algorithm === 'beaufort' ? Beaufort :
    algorithm === 'autokey' ? Autokey :
    algorithm === 'nihilist' ? Nihilist :
    algorithm === 'adfgvx' ? Adfgvx :
    algorithm === 'morse' ? Morse :
    algorithm === 'rot13' ? Rot13 :
    algorithm === 'pigpen' ? Pigpen :
    algorithm === 'saknussemm' ? Saknussemm :
    null;

  return (
    <ControlPanel>
      <DirectionRow>
        <DirectionLabel
          style={{ order: isDecryptMode ? 3 : 1, textAlign: isDecryptMode ? 'right' : 'left' }}
        >
          {`${t('message')}`}
        </DirectionLabel>
        {/* order lives on the Tooltip wrapper: it is the actual grid child */}
        <Tooltip
          content={t('learning.tooltips.swap')}
          style={{ order: 2 }}
        >
          <IconButton
            data-guide="swap"
            label={t('learning.tooltips.swap')}
            onClick={handleSwapMode}
          >
            <SwapIcon />
          </IconButton>
        </Tooltip>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            order: isDecryptMode ? 1 : 3,
            justifyContent: isDecryptMode ? 'flex-start' : 'flex-end',
          }}
        >
          <EcryptionSelector />
        </div>
      </DirectionRow>
      <SettingsRow>
        <Groove />
        <EncryptionComponent
          input={input}
          onProcessingEnd={onOutputUpdate}
          isDecryptMode={isDecryptMode}
          onInputChange={onInputChange}
          onVariantChange={onVariantChange}
        />
      </SettingsRow>
    </ControlPanel>
  );
};

EncryptionSettings.displayName = 'EncryptionSettings';

export default EncryptionSettings;
