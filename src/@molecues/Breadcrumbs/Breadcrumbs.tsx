import React, { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import { Chevron } from '@ornaments';
import type { Crumb } from '@lib/breadcrumbs';
import { focusRing } from '@theme/mixins';

// The category part of the header trail. All crumbs stay in the DOM (server
// and client render the same markup); CSS hides the earlier ones below the
// desktop breakpoint and the "…" button re-offers them in a paper popover.
export interface BreadcrumbsProps {
  trail?: Crumb[];
}

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  position: relative; /* anchors the "…" popover below the trail */
`;

const CrumbLink = styled(Link)`
  color: ${({ theme }) => theme.metal.brass.light};
  text-decoration: none;
  white-space: nowrap;
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover,
  &:focus-visible {
    color: ${({ theme }) => theme.ink.cream};
    ${focusRing}
  }

  /* Earlier crumbs are hidden until desktop; the "…" button carries them. */
  ${({ theme }) => theme.breakpoints.desktop} {
    display: inline;
  }
`;

const LastCrumb = styled(CrumbLink)`
  display: inline;
`;

const CrumbSeparator = styled.span`
  display: inline-flex;
  color: ${({ theme }) => theme.metal.brass.base};
  flex: none;
`;

const EllipsisButton = styled.button`
  appearance: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 8px;
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.metal.brass.light};
  font-family: ${({ theme }) => theme.type.engraved};
  font-size: 12px;
  cursor: pointer;

  &:hover,
  &:focus-visible {
    color: ${({ theme }) => theme.ink.cream};
    ${focusRing}
  }

  /* The button is only needed while earlier crumbs are hidden. */
  ${({ theme }) => theme.breakpoints.desktop} {
    display: none;
  }
`;

const Popover = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  z-index: 20;
  min-width: 220px;
  padding: 8px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.paper.ivory};
  border: 1px solid ${({ theme }) => theme.paper.rule};
  box-shadow: ${({ theme }) => theme.shadow.float};
`;

const PopoverLink = styled(Link)`
  display: flex;
  align-items: center;
  min-height: 44px;
  padding: 0 12px;
  border-radius: 4px;
  color: ${({ theme }) => theme.ink.primary};
  font-size: 13px;
  text-decoration: none;

  &:hover,
  &:focus-visible {
    background-color: ${({ theme }) => theme.metal.brass.base};
    color: ${({ theme }) => theme.ink.primary};
    ${focusRing}
  }
`;

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ trail }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const popoverId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);

  // Escape, outside click and route change close the popover; focus returns
  // to the "…" button (a11y: the trigger stays the anchor point).
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointer = (event: MouseEvent) => {
      if (
        !navRef.current?.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onPointer);
    };
  }, [open]);

  useEffect(() => {
    const close = () => setOpen(false);
    router.events.on('routeChangeStart', close);
    return () => router.events.off('routeChangeStart', close);
  }, [router]);

  if (!trail || trail.length === 0) return null;
  const hidden = trail.slice(0, -1);
  const last = trail[trail.length - 1];

  return (
    <Nav ref={navRef} aria-label={t('categories.labels.breadcrumb')}>
      {hidden.length > 0 && (
        <>
          <EllipsisButton
            ref={buttonRef}
            type="button"
            aria-expanded={open}
            aria-controls={popoverId}
            onClick={() => setOpen(!open)}
          >
            …
          </EllipsisButton>
          {open && (
            <Popover id={popoverId} role="group">
              {hidden.map((crumb) => (
                <PopoverLink key={crumb.path} href={crumb.path}>
                  {crumb.label}
                </PopoverLink>
              ))}
            </Popover>
          )}
        </>
      )}
      {trail.length > 1 && (
        <CrumbSeparator aria-hidden="true">
          <Chevron size={7} />
        </CrumbSeparator>
      )}
      <LastCrumb href={last.path}>{last.label}</LastCrumb>
    </Nav>
  );
};

Breadcrumbs.displayName = 'Breadcrumbs';

export default Breadcrumbs;
