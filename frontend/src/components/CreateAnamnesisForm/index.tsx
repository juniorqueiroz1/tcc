import React, { FormEvent, useCallback, useState } from 'react';
import api from '../../services/api';
import Alert from '../Alert';
import Button from '../Button';
import Title from '../Title';
import { Container, Form, FormActions } from './styles';

interface CreateAnamnesisFormProps {
  appointmentId: string;
  anamnesis?: { id: number; description: string };
  onSaveSuccess?: (anamnesis: any) => void;
  onCancel?: () => void;
}

const CreateAnamnesisForm: React.FC<CreateAnamnesisFormProps> = ({
  appointmentId,
  anamnesis,
  onSaveSuccess,
  onCancel,
}) => {
  const [description, setDescription] = useState(anamnesis?.description || '');
  const [error, setError] = useState('');

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setError('');
      
      try {
        const response = anamnesis
          ? await api.put(`/anamnese/${anamnesis.id}`, { description })
          : await api.post(`/anamnese`, { appointmentId, description });

        if (onSaveSuccess) {
          onSaveSuccess(response.data);
        }
      } catch (err: any) {
        setError('Erro ao salvar anamnese.');
      }
    },
    [appointmentId, description, onSaveSuccess, anamnesis]
  );

  return (
    <Container>
      <Title>{anamnesis ? 'Editar Anamnese' : 'Nova Anamnese'}</Title>
      <Form onSubmit={handleSubmit}>
        {error && <Alert>{error}</Alert>}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Anote aqui..."
          style={{ width: '100%', height: '200px', marginBottom: '10px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', resize: 'none' }}
        />
        <FormActions>
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={!description.trim()}>
            {anamnesis ? 'Atualizar' : 'Confirmar'}
          </Button>
        </FormActions>
      </Form>
    </Container>
  );
};

export default CreateAnamnesisForm;
