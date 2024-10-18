import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 40px;

  h1 {
    margin-bottom: 20px;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;

  select {
    margin-top: 20px;
  }
`;

export const FormActions = styled.div`
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media only screen and (max-width: 576px) {
    flex-direction: column-reverse;
    align-items: stretch;

    button + button {
      margin-bottom: 20px;
    }
  }
`;
