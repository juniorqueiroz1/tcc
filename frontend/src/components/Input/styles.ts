import styled, { css } from 'styled-components';
import colors from '../../styles/colors';

interface InputProps {
  active?: boolean;
}

export const Container = styled.div<InputProps>`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: relative;

  label {
    color: ${colors.gray};
    background-color: ${colors.white};
    position: absolute;
    bottom: 15px;
    left: 8px;
    transition: all 0.2s ease-in-out;
    ${props =>
      props.active &&
      css`
        transform: translateY(-150%);
        padding: 0 6px 0 2px;
      `};
  }

  svg {
    position: absolute;
    bottom: 15px;
    right: 8px;
    color: ${colors.gray};
  }
`;

export const InputContainer = styled.input`
  border: 1px solid ${colors.gray};
  border-radius: 4px;
  padding: 15px 8px;

  &:focus {
    border: 1px solid ${colors.primary};
  }

  &::placeholder {
    color: ${colors.gray};
  }

  &:disabled {
    background-color: ${colors.grayLight};
    cursor: not-allowed;
  }
`;
