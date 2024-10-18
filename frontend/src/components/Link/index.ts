import styled from 'styled-components';
import colors from '../../styles/colors';

const Link = styled.a`
  cursor: pointer;
  color: ${colors.primary};
  text-decoration: none;
  transition: background-color 200ms ease-in-out;

  &:hover {
    color: ${colors.primaryHover};
  }
`;

export default Link;
