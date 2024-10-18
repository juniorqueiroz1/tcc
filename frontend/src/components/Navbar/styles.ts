import styled from 'styled-components';
import colors from '../../styles/colors';

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 17px;

  img {
    height: 25px;
  }

  span {
    color: ${colors.gray};
    padding-right: 40px;
  }
`;
