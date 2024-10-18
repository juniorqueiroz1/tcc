import styled from 'styled-components';
import colors from '../../styles/colors';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: relative;

  svg {
    position: absolute;
    bottom: 15px;
    right: 8px;
    color: ${colors.gray};
  }
`;

export const SelectContainer = styled.select`
  border: 1px solid ${colors.gray};
  border-radius: 4px;
  padding: 15px 8px;
  color: ${colors.black};
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  &:invalid {
    color: ${colors.gray};
  }

  &:disabled {
    background-color: ${colors.grayLight};
    color: ${colors.gray};
    cursor: not-allowed;
  }

  option[value=''] {
    color: ${colors.gray};
  }
`;
