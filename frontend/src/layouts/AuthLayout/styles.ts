import styled from 'styled-components';

export const Container = styled.div`
  height: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  img {
    height: 50px;
    margin-bottom: 20px;
    align-self: flex-start;
  }

  form {
    display: flex;
    flex-direction: column;

    input {
      margin-top: 20px;
    }
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
