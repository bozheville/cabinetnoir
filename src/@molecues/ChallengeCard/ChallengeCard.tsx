import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { Button, Heading, Pane, Text, TextInput } from 'evergreen-ui';
import styled from 'styled-components';

import { Challenge } from '@learning/challenges';
import GlyphRenderer from '@molecues/GlyphRenderer';

const Card = styled(Pane)`
  width: 100%;
  max-width: 720px;
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.colorScheme.gray[300]};
  border-radius: 4px;
  text-align: left;
`;

const Ciphertext = styled(Pane)`
  font-family: monospace;
  font-size: 13px;
  word-break: break-all;
  padding: 8px;
  margin: 8px 0;
  background: ${({ theme }) => theme.colorScheme.gray[100]};
  border-radius: 4px;
`;

const GlyphCiphertext = styled(GlyphRenderer)`
  display: block;
  padding: 8px;
  margin: 8px 0;
  background: ${({ theme }) => theme.colorScheme.gray[100]};
  border-radius: 4px;
  color: ${({ theme }) => theme.colorScheme.black};
`;

const DifficultyBadge = styled(Text)<{ $difficulty: string }>`
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  text-transform: uppercase;
  background: ${({ theme, $difficulty }) => ({
    easy: theme.colorScheme.green[100],
    medium: theme.colorScheme.yellow[100],
    hard: theme.colorScheme.red[100],
  } as any)[$difficulty]};
`;

const onlyLetters = (value: string): string =>
  value.toUpperCase().split('').filter((char) => char >= 'A' && char <= 'Z').join('');

interface ChallengeCardProps {
  challenge: Challenge;
}

// A practice challenge: the user can reveal hints one by one, open the
// ciphertext in the tool (with the cracker on) and check their answer.
// Nothing is remembered: reload resets everything.
const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge }) => {
  const { t } = useTranslation('common');
  const [revealedHints, setRevealedHints] = useState(0);
  const [answer, setAnswer] = useState('');
  const [checked, setChecked] = useState<'none' | 'correct' | 'wrong'>('none');
  const [showAnswer, setShowAnswer] = useState(false);

  const check = () => {
    setChecked(
      onlyLetters(answer) === onlyLetters(challenge.answer) ? 'correct' : 'wrong',
    );
  };

  const toolHref = `/encoder/${challenge.cipher}/${challenge.mode === 'decrypt' ? 'reverse' : 'direct'}?challenge=${challenge.id}`;

  return (
    <Card>
      <Pane display="flex" alignItems="center" gap="8px">
        <Heading size={300}>{t(challenge.titleKey)}</Heading>
        <DifficultyBadge $difficulty={challenge.difficulty}>
          {t(`learning.challenge.labels.${challenge.difficulty}`)}
        </DifficultyBadge>
      </Pane>
      {challenge.glyphVariant ? (
        <GlyphCiphertext text={challenge.ciphertext} variant={challenge.glyphVariant} size={26} />
      ) : (
        <Ciphertext>{challenge.ciphertext}</Ciphertext>
      )}

      <Pane display="flex" flexDirection="column" gap="4px" marginTop="4px">
        {challenge.hints.slice(0, revealedHints).map((hint) => (
          <Text key={hint} size={300}>
            {t(hint)}
          </Text>
        ))}
        {revealedHints < challenge.hints.length && (
          <Button
            width="fit-content"
            onClick={() => setRevealedHints(revealedHints + 1)}
          >
            {t('learning.challenge.revealHint')}
          </Button>
        )}
      </Pane>

      <Pane display="flex" alignItems="center" gap="8px" marginTop="8px" flexWrap="wrap">
        <TextInput
          width="240px"
          placeholder={t('learning.challenge.answerPlaceholder')}
          value={answer}
          onChange={(event) => {
            setAnswer(event.target.value);
            setChecked('none');
          }}
        />
        <Button appearance="primary" onClick={check}>
          {t('learning.challenge.check')}
        </Button>
        {checked === 'correct' && (
          <Text size={300} color="green">
            {t('learning.challenge.correct')}
          </Text>
        )}
        {checked === 'wrong' && (
          <Text size={300} color="red">
            {t('learning.challenge.wrong')}
          </Text>
        )}
      </Pane>

      <Pane display="flex" gap="8px" marginTop="8px" alignItems="center" flexWrap="wrap">
        <Link href={toolHref}>
          <Text size={300} color="blue">
            {t('learning.challenge.openInTool')}
          </Text>
        </Link>
        <Text size={300}>·</Text>
        {!showAnswer ? (
          <Button
            onClick={() => {
              setShowAnswer(true);
            }}
          >
            {t('learning.challenge.showAnswer')}
          </Button>
        ) : (
          <Text size={300} fontFamily="monospace">
            {t('learning.challenge.answerIs')}
            {': '}
            {challenge.answer.toLowerCase()}
          </Text>
        )}
      </Pane>
    </Card>
  );
};

ChallengeCard.displayName = 'ChallengeCard';

export default ChallengeCard;
