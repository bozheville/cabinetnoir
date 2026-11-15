import type { Crumb } from '@lib/breadcrumbs';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';

import Section from '@atoms/Section/Section';
import { Paper } from '@atoms';
import { ToolCase } from '@organisms';
import HeadingRule from '@ornaments/HeadingRule';
import TabPlates from '@molecues/TabPlates';
import AtGlanceCard from '@molecues/AtGlanceCard';
import Breadcrumbs from '@molecues/Breadcrumbs';
import MarkdownContent from '@molecues/MarkdownContent';
import RelatedCiphers from '@molecues/RelatedCiphers';
import GlossarySection from '@molecues/GlossarySection';
import ChallengeCard from '@molecues/ChallengeCard';
import { Minion } from '@typography';
import { getChallenges } from '@learning/challenges';
import type { HistoryReviewInfo } from '@learning/review';

const LearningWrapper = styled(Section)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex: 1 0 auto;
  padding-top: 48px;
`;

// The storytelling tabs dock onto a lintel (double rule + lozenge),
// not the full tool frame; the case is sheet-wide.
const StoryCase = styled(ToolCase)`
  max-width: ${({ theme }) => theme.widths.sheet};
  width: 100%;
  margin-top: 8px;
`;

const StoryBody = styled.div`
  padding: 24px 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
`;

// Each markdown block is a paper sheet on the green band.
const Sheet = styled(Paper)`
  width: 100%;
  max-width: ${({ theme }) => theme.widths.sheet};
  padding: 24px;
  margin-top: 8px;
`;

const TabTitle = styled(HeadingRule)`
  width: 100%;
  max-width: ${({ theme }) => theme.widths.sheet};
`;

const CipherSubtitle = styled(Minion)`
  color: ${({ theme }) => theme.ink.creamMuted};
`;

// Byline on reviewed history pages (task 06): author name links to the
// About page, date comes from git via the review prop.
const Byline = styled(Minion)`
  width: 100%;
  max-width: ${({ theme }) => theme.widths.sheet};
  margin-top: 4px;
  color: ${({ theme }) => theme.ink.creamMuted};

  a {
    color: ${({ theme }) => theme.metal.copper.dark};
    text-decoration: underline;
    text-underline-offset: 3px;
  }
`;

// Notice on machine-translated pages the author has not reviewed.
const AutoNote = styled(Minion)`
  width: 100%;
  max-width: ${({ theme }) => theme.widths.sheet};
  margin-top: 8px;
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.paper.rule};
  border-left: 2px solid ${({ theme }) => theme.metal.brass.base};
  color: ${({ theme }) => theme.ink.creamMuted};
`;

const PlaceholderText = styled(Minion)`
  color: ${({ theme }) => theme.ink.creamMuted};
`;

// Learning tab layout (Learn / History / Practice). Each tab replaces the
// encryption UI on screen and gets its own URL. Markdown content arrives
// via getStaticProps (build time) and renders in the tab's topic order.
const TOPIC_ORDER = ['how-it-works', 'guides', 'breaking-it', 'history'];
interface LearningMaterialProps {
  /** Classic breadcrumb trail above the AtGlanceCard (task 05). */
  trail?: Crumb[];
  learningContent?: Record<string, string>;
  // History-tab review state (task 06): flags + dates from git, resolved
  // in getStaticProps; undefined on every other tab.
  review?: HistoryReviewInfo | null;
}

const LearningMaterial: React.FC<LearningMaterialProps> = ({ learningContent = {}, review, trail }) => {
  const { t } = useTranslation('common');
  const { algorithm, action } = useRouter().query;
  const tab = action as string;

  const sheets = TOPIC_ORDER.filter((topic) => learningContent[topic]).map((topic) => (
    <Sheet key={topic}>
      <MarkdownContent source={learningContent[topic]} />
    </Sheet>
  ));

  const reviewedHistory = tab === 'history' && review?.reviewed === true;

  // History meta (task 06 + 12): byline on reviewed pages, an
  // automated-translation notice on unreviewed machine translations.
  // Both flags true → both, so the byline never claims more than the
  // notice corrects.
  const historyMeta = tab === 'history' && review ? (
    <>
      {review.reviewed && (
        <Byline>
          {t('learning.review.by')}{' '}
          <Link href="/about">{t('learning.review.author')}</Link>
          {review.dateModifiedLabel && (
            <>
              {' · '}
              {t('learning.review.updated')}{' '}
              <time dateTime={review.dateModified}>{review.dateModifiedLabel}</time>
            </>
          )}
        </Byline>
      )}
      {review.autoTranslated && (
        <AutoNote>{t('learning.review.autoTranslatedNote')}</AutoNote>
      )}
    </>
  ) : null;

  return (
    <LearningWrapper stitch="both" zone="learn">
      {trail && trail.length > 0 && <Breadcrumbs trail={trail} />}
      <AtGlanceCard />
      <StoryCase
        variant="lintel"
        tabs={<TabPlates algorithm={algorithm as string} activeTab={tab as any} />}
      >
        <StoryBody>
          <TabTitle on="dark">{t(`learning.tabs.${tab}`)}</TabTitle>
          <CipherSubtitle>{t(`processing.${algorithm as string}.title`)}</CipherSubtitle>
          {Object.keys(learningContent).length === 0 && (
            <div>
              <PlaceholderText>{t('learning.placeholder')}</PlaceholderText>
            </div>
          )}
          {/* Reviewed history pages read as articles: byline + content in
              one <article> element, matching the Article JSON-LD. */}
          {reviewedHistory ? (
            <article>
              {historyMeta}
              {sheets}
            </article>
          ) : (
            <>
              {historyMeta}
              {sheets}
            </>
          )}
          {tab === 'learn' && <GlossarySection algorithm={algorithm as string} />}
          {tab === 'practice' && getChallenges(algorithm as string).map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
          {/* Related-cipher links close every learning tab (task 08). */}
          <Sheet>
            <RelatedCiphers algorithm={algorithm as string} />
          </Sheet>
        </StoryBody>
      </StoryCase>
    </LearningWrapper>
  );
};

LearningMaterial.displayName = 'LearningMaterial';

export default LearningMaterial;
