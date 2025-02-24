import Modal from 'react-modal';
import styled from 'styled-components';
import colors from '../../styles/colors';

export const Container = styled.div`
  max-width: 627px;
  margin: 0 auto;
  padding: 18px 0;
  height: 100%;
`;

export const Box = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
  padding: 16px 8px;
  margin-bottom: 10px;

  table {
    border-spacing: 0;

    thead {
      th {
        text-align: left;
        color: ${colors.gray};
        text-transform: uppercase;
        padding: 8px;
      }
    }

    tbody {
      tr {
        &:nth-child(odd) {
          background-color: ${colors.grayLight};
        }

        td {
          padding: 8px;
        }
      }
    }
  }
`;

export const BoxHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 17px;
`;

export const ModalStyle: Modal.Styles = {
  content: {
    padding: 0,
    width: 500,
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    border: 'none',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
};

// Input component
export const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

// Select component
export const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

// Button component
export const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 4px;
`;

// Form component
export const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;


export const TabsButton = styled.button`
  width: 40%;
  padding: 10px;
  margin: 5px 30px 10px;
  background-color: #49b4bb;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  transition: all 0.3s ease; /* Adiciona uma transição suave para todas as propriedades */

  &:hover {
    background-color: #d9f1f3;
    font-weight: normal;
  }
`;

export const ModalStyles: Modal.Styles = {
  content: {
    padding: 0,
    width: 500,
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    border: 'none',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
};

export const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;

  button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 8px 12px;
    margin: 0 5px;
    cursor: pointer;
    border-radius: 5px;
    
    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  }

  span {
    margin: 0 10px;
    font-weight: bold;
  }
`;