import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';

import { Minion } from '@typography';
import type {
  CipherCandidate,
  FamilyCandidate,
  IdentificationResult,
} from '@encryptors/shared/identification/types';

import {
  Badge,
  CardHead,
  CardName,
  CardReasons,
  CipherCard,
  CipherGrid,
  FamilyBlock,
  FamilyBody,
  FamilyHeader,
  ReasonsList,
  RoadmapBadge,
  ScoreBar,
} from './elements';

// Renders one predefined reason: locale key `identify.reasons.<id>`
// filled with the rule's numeric params.
const ReasonLine: React.FC<{ id: string; params?: Record<string, number | string> }> = ({ id, params }) => {
  const { t } = useTranslation('common');
  return <li>{t(`identify.reasons.${id}`, params)}</li>;
};

const ConfidenceBadge: React.FC<{ confidence: string }> = ({ confidence }) => {
  const { t } = useTranslation('common');
  return <Badge $confidence={confidence}>{t(`identify.confidence.${confidence}`)}</Badge>;
};

const Score: React.FC<{ score: number }> = ({ score }) => (
  <ScoreBar>
    <div style={{ width: `${score}%` }} />
  </ScoreBar>
);

const CipherEntry: React.FC<{ cipher: CipherCandidate }> = ({ cipher }) => {
  const { t } = useTranslation('common');
  return (
    <CipherCard $dimmed={cipher.confidence === 'ruledOut' || cipher.confidence === 'unlikely'}>
      <CardHead>
        <CardName>{t(`identify.ciphers.${cipher.id}`)}</CardName>
        <ConfidenceBadge confidence={cipher.confidence} />
      </CardHead>
      <Score score={cipher.score} />
      {!cipher.inApp && <RoadmapBadge>{t('identify.roadmapBadge')}</RoadmapBadge>}
      <CardReasons>
        {cipher.reasons.map((reason) => (
          <ReasonLine key={reason.id} id={reason.id} params={reason.params} />
        ))}
      </CardReasons>
    </CipherCard>
  );
};

const FamilyEntry: React.FC<{ family: FamilyCandidate }> = ({ family }) => {
  const { t } = useTranslation('common');
  const ruledOut = family.confidence === 'ruledOut';
  const [open, setOpen] = useState(!ruledOut);

  return (
    <FamilyBlock>
      <FamilyHeader
        $dimmed={ruledOut}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        <CardName>{t(`identify.families.${family.family}`)}</CardName>
        <ConfidenceBadge confidence={family.confidence} />
        <span style={{ flex: 1 }}>
          <Score score={family.score} />
        </span>
      </FamilyHeader>
      {open && (
        <FamilyBody>
          {family.reasons.length > 0 && (
            <ReasonsList>
              {family.reasons.map((reason) => (
                <ReasonLine key={reason.id} id={reason.id} params={reason.params} />
              ))}
            </ReasonsList>
          )}
          <CipherGrid>
            {family.ciphers.map((cipher) => (
              <CipherEntry key={cipher.id} cipher={cipher} />
            ))}
          </CipherGrid>
        </FamilyBody>
      )}
    </FamilyBlock>
  );
};

// The ranked tree: families best first, each with its ciphers best
// first. `ruledOut` families stay visible but collapsed — the "why not"
// is educational too.
const ResultsTree: React.FC<{ result: IdentificationResult }> = ({ result }) => {
  const { t } = useTranslation('common');

  return (
    <div>
      <Minion>{t('identify.resultsHeading')}</Minion>
      {result.families.map((family) => (
        <FamilyEntry key={family.family} family={family} />
      ))}
    </div>
  );
};

export default ResultsTree;
