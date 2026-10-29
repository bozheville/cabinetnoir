import React from 'react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useTheme } from 'styled-components';
import styled from 'styled-components';

import { Button, Patch } from '@atoms';
import { stitch } from '@theme/mixins';
import { BodyCopy, Caption, GreatPrimer, Minion } from '@typography';
import { CIPHER_LADDER, getLearningConfig } from '@learning/config';

// Family -> leather (spec 05 "CipherLadder cards"): encodings tan,
// monoalphabetic chestnut, polyalphabetic green, transposition navy,
// grid/fractionating oxblood, symbol/glyph olive, machine chestnut
// with a copper thread.
const FAMILY_LEATHER: Record<string, string> = {
  base64: 'tan', morse: 'tan', rot13: 'tan',
  atbash: 'chestnut', caesar: 'chestnut', affine: 'chestnut', keyword: 'chestnut',
  vigenere: 'green', beaufort: 'green', autokey: 'green',
  railFence: 'navy', columnar: 'navy',
  polybius: 'oxblood', nihilist: 'oxblood', adfgvx: 'oxblood', playfair: 'oxblood',
  pigpen: 'olive', saknussemm: 'olive',
  alberti: 'chestnut', enigma: 'chestnut',
};

const Grid = styled.div`
  margin-top: 24px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;

  ${({ theme }) => theme.breakpoints.tablet} {
    grid-template-columns: repeat(2, 1fr);
  }
  ${({ theme }) => theme.breakpoints.desktop} {
    grid-template-columns: repeat(3, 1fr);
  }
  ${({ theme }) => theme.breakpoints.wide} {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const Card = styled(Patch)`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 16px 16px;
  transition: transform 120ms ease-out;
  cursor: default;

  /* Text colours follow the leather: cream on dark hides, ink on tan. */
  color: ${({ theme }) => theme.ink.cream};

  &[data-leather='tan'] {
    color: ${({ theme }) => theme.ink.primary};
  }

  /* Hover: the stitch turns gold and the card lifts by 2px. */
  &:hover {
    ${stitch('all', 'gold', 5)}
    transform: translateY(-2px);
  }
`;

const FamilyLabel = styled(Caption)`
  color: ${({ theme }) => theme.metal.brass.light};
  margin-bottom: 4px;

  [data-leather='tan'] & {
    color: ${({ theme }) => theme.ink.secondary};
  }
`;

const CardTitle = styled(GreatPrimer)`
  color: inherit;
  margin: 0;
`;

const CardLinks = styled.div`
  display: flex;
  gap: 8px;
  margin-top: auto;
  padding-top: 12px;
`;

const GlanceLine = styled(Minion)`
  color: ${({ theme }) => theme.ink.creamMuted};

  [data-leather='tan'] & {
    color: ${({ theme }) => theme.ink.secondary};
  }
`;

const UtilitiesNote = styled(BodyCopy)`
  margin-top: 20px;
  text-align: center;
  color: ${({ theme }) => theme.ink.primary};

  a {
    color: ${({ theme }) => theme.metal.copper.dark};
  }
`;


const LadderHead = styled.div`
  text-align: center;

  ${GreatPrimer} {
    color: ${({ theme }) => theme.ink.primary};
  }

  ${Minion} {
    color: ${({ theme }) => theme.ink.secondary};
  }
`;

// The cipher ladder (#74): every cipher in one difficulty-ordered list —
// climb from the trivial to Enigma. Card facts come from the same
// learning config that drives the per-cipher at-a-glance block.
const CipherLadder: React.FC = () => {
  const { t } = useTranslation('common');
  const theme = useTheme();

  return (
    <>
      <LadderHead>
        <GreatPrimer>{t('home.ladder.title')}</GreatPrimer>
        <Minion>{t('home.ladder.subtitle')}</Minion>
      </LadderHead>
      <Grid>
        {CIPHER_LADDER.map((cipher) => {
          const { atGlance } = getLearningConfig(cipher);
          const base = `/encoder/${cipher}`;
          const familyLeather = FAMILY_LEATHER[cipher] || 'tan';
          // Machine ciphers get a copper thread on their chestnut card.
          const isMachine = cipher === 'alberti' || cipher === 'enigma';

          return (
            <Card
              key={cipher}
              shape="card"
              leather={familyLeather}
              data-leather={familyLeather}
              thread={isMachine ? theme.metal.copper.base : undefined}
            >
              <FamilyLabel>{t(atGlance.type)}</FamilyLabel>
              <CardTitle>{t(`processing.${cipher}.title`)}</CardTitle>
              <GlanceLine>
                {`${t(atGlance.type)} · ${t(atGlance.difficulty)}`}
              </GlanceLine>
              <CardLinks>
                <Button href={`${base}/direct`} variant="primary" size="sm">
                  {t('home.ladder.tool')}
                </Button>
                <Button href={`${base}/learn`} variant="secondary" size="sm">
                  {t('home.ladder.learn')}
                </Button>
              </CardLinks>
            </Card>
          );
        })}
      </Grid>
      <UtilitiesNote>
        <Link href="/encoder/base64/direct">{t('home.ladder.utilitiesNote')}</Link>
        {' · '}
        <Link href="/encoder/saknussemm/history">{t('home.ladder.easterEggNote')}</Link>
      </UtilitiesNote>
    </>
  );
};

CipherLadder.displayName = 'CipherLadder';

export default CipherLadder;
