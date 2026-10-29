import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

import { Badge, Button, Paper, TextInput } from '@atoms';
import { CipherText, GreatPrimer, Minion } from '@typography';

import { Challenge } from '@learning/challenges';
import GlyphRenderer from '@molecues/GlyphRenderer';

// Telegram envelope: parchment paper.
const Card = styled(Paper).attrs({ tone: 'parchment' })`
  width: 100%;
  max-width: 720px;
  padding: 12px 16px;
  margin: 8px auto;
  text-align: left;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Title = styled(GreatPrimer)`
  margin: 0;
  min-width: 0;
`;

const Ciphertext = styled(Paper).attrs({ tone: 'ivory', ruled: true })`
  padding: 8px;
  margin: 8px 0;
  word-break: break-all;
`;

const CiphertextText = styled(CipherText)`
  font-size: 13px;
`;

const GlyphCiphertext = styled(GlyphRenderer)`
  display: block;
  padding: 8px;
  margin: 8px 0;
  background-color: ${({ theme }) => theme.paper.parchment};
  border: 1px solid ${({ theme }) => theme.paper.rule};
  border-radius: 2px;
  color: ${({ theme }) => theme.ink.primary};
`;

const Hints = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 4px;
`;

const HintText = styled(Minion)`
  color: ${({ theme }) => theme.ink.primary};
`;

const AnswerRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  flex-wrap: wrap;
`;

const ResultText = styled(Minion)<{ $tone: 'green' | 'red' }>`
  color: ${({ theme, $tone }) => ($tone === 'green' ? theme.ink.green : theme.ink.red)};
`;

const AnswerIsText = styled(CipherText)`
  font-size: 13px;
  color: ${({ theme }) => theme.ink.primary};
`;

const FooterRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
  align-items: center;
  flex-wrap: wrap;
`;

const ToolLink = styled(Link)`
  font-family: ${({ theme }) => theme.type.body};
  font-size: 13px;
  line-height: 20px;
  color: ${({ theme }) => theme.metal.copper.dark};
  text-decoration: underline;
  text-underline-offset: 3px;
`;

const Divider = styled(Minion)`
  color: ${({ theme }) => theme.ink.secondary};
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
      <HeaderRow>
        <Title>{t(challenge.titleKey)}</Title>
        <Badge tone={challenge.difficulty}>
          {t(`learning.challenge.labels.${challenge.difficulty}`)}
        </Badge>
      </HeaderRow>
      {challenge.glyphVariant ? (
        <GlyphCiphertext text={challenge.ciphertext} variant={challenge.glyphVariant} size={26} />
      ) : (
        <Ciphertext>
          <CiphertextText>{challenge.ciphertext}</CiphertextText>
        </Ciphertext>
      )}

      <Hints>
        {challenge.hints.slice(0, revealedHints).map((hint) => (
          <HintText key={hint}>{t(hint)}</HintText>
        ))}
        {revealedHints < challenge.hints.length && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setRevealedHints(revealedHints + 1)}
          >
            {t('learning.challenge.revealHint')}
          </Button>
        )}
      </Hints>

      <AnswerRow>
        <TextInput
          width="240px"
          mono
          placeholder={t('learning.challenge.answerPlaceholder')}
          value={answer}
          onChange={(event) => {
            setAnswer(event.target.value);
            setChecked('none');
          }}
        />
        <Button variant="primary" size="md" onClick={check}>
          {t('learning.challenge.check')}
        </Button>
        {checked === 'correct' && (
          <ResultText $tone="green">{t('learning.challenge.correct')}</ResultText>
        )}
        {checked === 'wrong' && (
          <ResultText $tone="red">{t('learning.challenge.wrong')}</ResultText>
        )}
      </AnswerRow>

      <FooterRow>
        <ToolLink href={toolHref}>
          {t('learning.challenge.openInTool')}
        </ToolLink>
        <Divider>·</Divider>
        {!showAnswer ? (
          <Button
            variant="quiet"
            size="sm"
            onClick={() => {
              setShowAnswer(true);
            }}
          >
            {t('learning.challenge.showAnswer')}
          </Button>
        ) : (
          <AnswerIsText>
            {t('learning.challenge.answerIs')}
            {': '}
            {challenge.answer.toLowerCase()}
          </AnswerIsText>
        )}
      </FooterRow>
    </Card>
  );
};

ChallengeCard.displayName = 'ChallengeCard';

export default ChallengeCard;
