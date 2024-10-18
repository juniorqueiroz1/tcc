import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import Modal from 'react-modal';
import Button from '../../components/Button';
import CreateSpecialistForm from '../../components/CreateSpecialistForm';
import Navbar from '../../components/Navbar';
import Title from '../../components/Title';
import Appointment from '../../models/Appointment';
import Speciality from '../../models/Speciality';
import api from '../../services/api';
import { Box, BoxHeader, Container, ModalStyle } from './styles';

Modal.setAppElement('#root');

function getAppointmentDate(appointment: Appointment): Date {
  const [hours, minutes] = appointment.time.split(':');
  const date = new Date(appointment.date);

  date.setHours(parseInt(hours));
  date.setMinutes(parseInt(minutes));

  return date;
}

interface Errors {
  [key: string]: string | undefined;
}

const Dashboard: React.FC = () => {
  const [specialities, setSpecialities] = useState<Speciality[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [id, setId] = useState(0);

  const [errors, setErrors] = useState<Errors>({});

  const [formData1, setFormData1] = useState({
    name: '',
    description: '',
  });

  const [creationError, setCreationError] = useState('');

  useEffect(() => {
    (async () => {
      const response = await api.get<Speciality[]>('/specialities');

      setSpecialities(response.data);
    })();
  }, []);

  const openModal = useCallback((id_) => {

    (async () => {
      if (id_ !== 0) {
        setId(id_);

        const response = await api.get<Speciality>('/specialities/' + id_);

        setFormData1(response.data);
      }
      

   
      

      setIsModalOpen(true);
    })();

    
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const resetErrors = () => {
    setErrors({});
  };



  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.persist();
      try {
        event.preventDefault();

        resetErrors();
        console.log(id);
        
        const req = await api.post<Speciality>(
          '/specialities',
          {
            id: id,
            ...formData1
          },
        );

        const response = await api.get<Speciality[]>('/specialities');

        setSpecialities(response.data);
        
      } catch (err: any) {
        if (err.response && err.response.status === 409) {
          const { detail } = err.response.data;
          setCreationError(detail);
        } else {
          setCreationError('Não foi possível cadastrar.');
        }
      }
    },
    [formData1]
  );

  return (
    <Container>
      <Navbar />
      <Box>
        <BoxHeader>
          <Title>Especialidade</Title>
          <Button type="button" size="small" onClick={() => openModal(0)}>
            <FaPlus />
            Adicionar especialidade
          </Button>
        </BoxHeader>

        <table>
          <thead>
            <tr>
              <th>Especialidade</th>
              <th>Descrição</th>
            </tr>
          </thead>
          <tbody>
            {specialities.length > 0 ? (
              specialities.map(speciality => (
                <tr key={speciality.id}>
                  <td>{speciality.name}</td>
                  <td>{speciality.description}</td>
                  <td>
                    <Button type="button" style={{ minWidth: '30px' }} size="small" onClick={() => openModal(speciality.id)}>
                      <FaPlus />
                      Ver mais
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td align="center" colSpan={5}>
                  Nenhum especista até o momento
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Box>

      <Modal
        isOpen={isModalOpen}
        shouldCloseOnOverlayClick={true}
        onRequestClose={closeModal}
        style={ModalStyle}
      >
        <CreateSpecialistForm
          onCancel={closeModal}
          formData1={formData1}
          setFormData1={setFormData1}
          creationError={creationError}
          handleSubmit={handleSubmit}
        />
      </Modal>

      {/* <Modal
        isOpen={isNewModalOpen}
        shouldCloseOnOverlayClick={true}
        onRequestClose={closeNewModal}
        style={TextModal}
      >
        <div>
          <h2 style={{ paddingBottom: '30px' }}>Descrição da especialidade</h2>
          <textarea
            value={textareaContent}
            onChange={(e) => setTextareaContent(e.target.value)}
            placeholder="Anote aqui..."
            style={{ width: '100%', height: '200px', marginBottom: '10px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', resize: 'none' }}
          />
          <BoxHeader>
            <Button type="button" onClick={closeNewModal} style={buttonStyles}>
              Fechar
            </Button>
          </BoxHeader>
        </div>
      </Modal> */}

    </Container>
  );
};

export default Dashboard;
