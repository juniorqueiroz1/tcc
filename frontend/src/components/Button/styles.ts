import { FaCircleNotch } from 'react-icons/fa';
import styled, { css, keyframes } from 'styled-components';
import colors from '../../styles/colors';

interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger';
  size: 'normal' | 'small';
}

const normalSizeStyle = css`
  font-weight: bold;
  font-size: 18px;
  min-width: 180px;
  padding: 10px;
  border-radius: 8px;
`;

const smallSizeStyle = css`
  font-weight: normal;
  font-size: 13px;
  min-width: 138px;
  padding: 6px 12px;
  border-radius: 4px;
`;

const primaryVariantStyle = css`
  color: ${colors.white};
  background-color: ${colors.primary};

  &:hover:not(:disabled) {
    background-color: ${colors.primaryHover};
  }

  &:disabled {
    background-color: ${colors.secondaryHover};
    cursor: not-allowed;
  }
`;

const secondaryVariantStyle = css`
  color: ${colors.primary};
  background-color: transparent;

  &:hover:not(:disabled),
  &:focus {
    background-color: ${colors.secondaryHover};
  }

  &:disabled {
    color: ${colors.secondaryHover};
    cursor: not-allowed;
  }
`;

const dangerVariantStyle = css`
  color: ${colors.white};
  background-color: ${colors.danger};

  &:hover:not(:disabled) {
    background-color: ${colors.danger};
  }

  &:disabled {
    background-color: ${colors.secondaryHover};
    cursor: not-allowed;
  }
`;

const getSizeStyle = ({ size }: ButtonProps) => {
  return size === 'normal' ? normalSizeStyle : smallSizeStyle;
};

const getVariantStyle = ({ variant }: ButtonProps) => {
  // return variant === 'primary' ? primaryVariantStyle : secondaryVariantStyle;
  if (variant === 'primary') {
    return primaryVariantStyle;
  } else if (variant === 'secondary') {
    return secondaryVariantStyle;
  } else {
    return dangerVariantStyle;
  }
};

const rotate = keyframes`
  100% {
    transform: rotate(360deg);
  }
}`;

export const ButtonContainer = styled.button<ButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 200ms ease-in-out;
  ${getSizeStyle}
  ${getVariantStyle}

  svg:first-child {
    margin-right: 14px;
  }
`;

export const Loading = styled(FaCircleNotch)`
  animation: ${rotate} 1s linear;
  animation-iteration-count: infinite;
`;
