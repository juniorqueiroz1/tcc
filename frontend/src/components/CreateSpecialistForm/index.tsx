import React, { useCallback } from 'react';
import Appointment from '../../models/Appointment';
import Alert from '../Alert';
import Button from '../Button';
import Input from '../Input';
import Title from '../Title';
import { Container, Form, FormActions } from './styles';

interface CreateAppointmentFormProps {
  onCreateSuccess?: (appointment: Appointment) => void;
  onCancel?: () => void;
  formData1?: any;
  setFormData1?: any;
  creationError?: string;
  handleSubmit?: any;
}

const CreateAppointmentForm: React.FC<CreateAppointmentFormProps> = ({
  onCancel,
  formData1,
  setFormData1,
  creationError,
  handleSubmit,
}) => {


  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = event.target;

      setFormData1((prevData : any) => ({ ...prevData, [name]: value }));
      
    },
    [setFormData1]
  );
  


  return (
    <Container>
      <Title>Nova Especialidade</Title>
      <Form onSubmit={handleSubmit}>
        {creationError && <Alert>{creationError}</Alert>}

        <Input
          required
          placeholder="Digite o nome da sua especialidade"
          name="name"
          onChange={handleInputChange}
          value={formData1.name}
        />

        <div>
          <textarea
            name='description'
            onChange={handleInputChange}
            value={formData1.description}
            placeholder="Descreva sua especialidade..."
            style={{ width: '100%', height: '200px', marginTop: '20px' , padding: '8px', border: '1px solid #ccc', borderRadius: '4px', resize: 'none' }}
          />
        </div>

        <FormActions>
          <Button
            type="button"
            variant="secondary"
            onClick={() => onCancel && onCancel()}
          >
            Cancelar
          </Button>

          <Button type="submit">
            Confirmar
          </Button>
        </FormActions>
      </Form>
    </Container>
  );
};

export default CreateAppointmentForm;
