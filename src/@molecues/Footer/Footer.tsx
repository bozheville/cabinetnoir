import React from 'react';
import { Heading } from 'evergreen-ui';
import Icon  from './coffee.svg';
import styled from 'styled-components';
import { useTranslation } from 'next-i18next';
import { ReleaseInfo } from '@atoms';


const ButtonText = styled.span`
  display: inline-block;
  margin-left: 8px;
`;

const FooterWrapper = styled.div`
  margin-top: 36px;
  text-align: center;
  padding: 16px;
`;

const BMCButton = styled.button`
  background-color: ${({ theme }) => theme.colors.buymeacoffeeButton.default};
  padding: 4px 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.small}px;
  border: 2px solid ${({ theme }) => theme.colorScheme.black};

  &:hover {
    background-color: ${({ theme }) => theme.colors.buymeacoffeeButton.hover};
  }
`;

const BMCWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8px;

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

const LinksWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8px;

  a {
    display: inline-block;
    text-decoration: underline;
    font-size: 12px;

    &:after {
      content: "•";
      display: inline-block;
      padding: 0 8px;
    }

    &:last-of-type:after {
      display: none;
    }
  }

  ${({ theme }) => theme.breakpoints.small} {
    flex-direction: column;
    a {
      display: inline-block;
      padding-top: 8px;

      &:after {
        display: none;
      }
    }

  }
`;

const Footer: React.FC = () => {
  const { t } = useTranslation('common');
  return (
    <FooterWrapper>
      <BMCWrapper>
        <span>
          {t('footer.did_you_like')}
        </span>
        <BMCButton as="a" href="https://www.buymeacoffee.com/denysgrybov">
          <Icon />
          <ButtonText>
            {t('footer.buy_me_a_coffee')}
          </ButtonText>
        </BMCButton>
      </BMCWrapper>
      <LinksWrapper>
        <a href="#">
        {t(`footer.about`)}
        </a>
        <a
          href="https://github.com/bozheville/cabinetnoir/issues/new"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t(`footer.suggest_a_feature`)}
        </a>
        <a
          href="https://github.com/bozheville/cabinetnoir/issues/new?labels=bug&template=bug_report.md"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t(`footer.report_a_bug`)}
        </a>
      </LinksWrapper>
      <Heading marginTop="16px" size={100}>
        {t(`footer.credentials`)}
      </Heading>
      <ReleaseInfo />
    </FooterWrapper>
  );
};

Footer.displayName = 'Footer';

export default Footer;
