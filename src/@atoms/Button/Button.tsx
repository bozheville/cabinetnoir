import React from 'react';
import styled, { css } from 'styled-components';
import { metal, focusRing, engraved } from '@theme/mixins';

export type ButtonVariant = 'primary' | 'secondary' | 'quiet';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Renders an anchor that looks like a button. */
  href?: string;
  fullWidth?: boolean;
}

const sizes: Record<ButtonSize, ReturnType<typeof css>> = {
  sm: css`
    height: 32px;
    padding: 0 12px;
    font-size: 12px;
    gap: 6px;
  `,
  md: css`
    height: 40px;
    padding: 0 20px;
    font-size: 13px;
    gap: 8px;
  `,
  lg: css`
    height: 48px;
    padding: 0 28px;
    font-size: 14px;
    gap: 10px;
  `,
};

const ButtonBase = styled.button<{ $variant: ButtonVariant; $size: ButtonSize; $full?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.metal};
  ${({ $size }) => sizes[$size]}
  ${({ $full }) => $full && 'width: 100%;'}
  ${engraved('metal')}
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;

  ${({ theme, $variant }) =>
    $variant === 'primary'
      ? metal('brass')
      : $variant === 'secondary'
      ? metal('copper')
      : css`
          background: transparent;
          border: none;
          color: ${({ theme }) => theme.metal.brass.light};
          box-shadow: none;
          text-shadow: none;
          padding-left: 0;
          padding-right: 0;
          &:hover:not(:disabled) { filter: brightness(1.15); }
          &:active:not(:disabled) { transform: translateY(1px); }
          &:disabled { color: ${({ theme }) => theme.metal.brass.patina}; cursor: not-allowed; }
        `}

  ${focusRing}

  /* quiet on paper: dark engraved label */
  ${({ theme, $variant }) =>
    $variant === 'quiet' &&
    css`
      color: ${({ theme }) => theme.metal.brass.dark};
      text-shadow: none;
    `}

  > svg { flex: none; }
`;

/**
 * Button: brass (primary), copper (secondary) or engraved-text (quiet).
 * One primary per block. Replaces evergreen Button and all link-buttons.
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', href, fullWidth, children, ...rest }, ref) => {
    const shared = { $variant: variant, $size: size, $full: fullWidth };
    if (href) {
      return (
        <ButtonBase as="a" href={href} ref={ref as never} {...shared} {...(rest as unknown as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
          {children}
        </ButtonBase>
      );
    }
    return (
      <ButtonBase ref={ref} {...shared} {...rest}>
        {children}
      </ButtonBase>
    );
  }
);

Button.displayName = 'Button';

export default Button;
