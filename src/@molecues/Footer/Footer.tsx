import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { useTranslation } from 'next-i18next';
import { ReleaseInfo, Button } from '@atoms';
import { CoffeeIcon, Lozenge } from '@ornaments';
import { Minion } from '@typography';
import Section from '@atoms/Section/Section';

const FooterWrapper = styled(Section)`
  /* Print: the footer is site chrome, not article content (spec 08). */
  @media print {
    display: none;
  }
  text-align: center;
`;

const BMCWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8px;
  flex-shrink: 0;

  & > span {
    display: inline-block;
    padding-right: 8px;
  }

  ${({ theme }) => theme.breakpoints.small} {
    & > span {
      padding-bottom: 8px;
    }

    flex-direction: column;
  }
`;

const DidYouLike = styled.span`
  font-family: ${({ theme }) => theme.type.body};
  color: ${({ theme }) => theme.ink.creamMuted};
`;

const LinkSep = styled.span`
  display: inline-flex;
  padding: 0 8px;
  color: ${({ theme }) => theme.metal.brass.base};

  ${({ theme }) => theme.breakpoints.small} {
    display: none;
  }
`;

const LinksWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8px;

  a {
    display: inline-block;
    text-decoration: none;
    font-family: ${({ theme }) => theme.type.engraved};
    font-size: 11px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.metal.brass.light};

    &:hover {
      color: ${({ theme }) => theme.metal.copper.light};
    }
  }

  ${({ theme }) => theme.breakpoints.small} {
    flex-direction: column;
    gap: 8px;

    a {
      padding-top: 8px;
    }
  }
`;

const CredentialsText = styled(Minion)`
  color: ${({ theme }) => theme.ink.creamMuted};
`;

const Footer: React.FC = () => {
  const { t } = useTranslation('common');
  return (
    <FooterWrapper color="footer" stitch="top" thread="gold">
      <BMCWrapper>
        <DidYouLike>
          {`${t('footer.did_you_like')}`}
        </DidYouLike>
        <Button
          href="https://www.buymeacoffee.com/denysgrybov"
          variant="secondary"
          size="md"
        >
          <CoffeeIcon />
          {`${t('footer.buy_me_a_coffee')}`}
        </Button>
      </BMCWrapper>
      <LinksWrapper>
        <a href="#">
          {`${t(`footer.about`)}`}
        </a>
        <LinkSep aria-hidden="true"><Lozenge size={5} /></LinkSep>
        <a
          href="https://github.com/bozheville/cabinetnoir/issues/new"
          target="_blank"
          rel="noopener noreferrer"
        >
          {`${t(`footer.suggest_a_feature`)}`}
        </a>
        <LinkSep aria-hidden="true"><Lozenge size={5} /></LinkSep>
        <a
          href="https://github.com/bozheville/cabinetnoir/issues/new?labels=bug&template=bug_report.md"
          target="_blank"
          rel="noopener noreferrer"
        >
          {`${t(`footer.report_a_bug`)}`}
        </a>
        <LinkSep aria-hidden="true"><Lozenge size={5} /></LinkSep>
        <Link href="/sitemap">
          {`${t(`footer.sitemap`)}`}
        </Link>
      </LinksWrapper>
      <CredentialsText>
        {`${t(`footer.credentials`)}`}
      </CredentialsText>
      <ReleaseInfo />
    </FooterWrapper>
  );
};

Footer.displayName = 'Footer';

export default Footer;
