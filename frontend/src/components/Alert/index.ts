import styled from 'styled-components';
import colors from '../../styles/colors';

const Alert = styled.div`
  color: ${colors.danger};
  background-color: ${colors.dangerLight};
  padding: 0.75rem 1.25rem;
  border-radius: 4px;
`;

export default Alert;
