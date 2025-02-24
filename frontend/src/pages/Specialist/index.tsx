import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaPlus } from 'react-icons/fa';
import Modal from 'react-modal';
import Button from '../../components/Button';
import CreateSpecialistForm from '../../components/CreateSpecialistForm';
import Navbar from '../../components/Navbar';
import Title from '../../components/Title';
import Speciality from '../../models/Speciality';
import api from '../../services/api';
import { Box, BoxHeader, Container, ModalStyle } from './styles';

Modal.setAppElement('#root');

interface Errors {
  [key: string]: string | undefined;
}

const Dashboard: React.FC = () => {
  const [specialities, setSpecialities] = useState<Speciality[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [id, setId] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [formData1, setFormData1] = useState({ name: '', description: '' });
  const [creationError, setCreationError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Estados para paginação
  const [page, setPage] = useState(1);
  const limit = 5; // Número de especialidades por página
  const totalPages = Math.ceil(specialities.length / limit);
  const dataPaginated = specialities.slice((page - 1) * limit, page * limit);

  useEffect(() => {
    (async () => {
      const response = await api.get<Speciality[]>('/specialities');
      setSpecialities(response.data);
    })();
  }, []);

  // Sempre que a lista for atualizada, opcionalmente reseta para a página 1
  useEffect(() => {
    setPage(1);
  }, [specialities]);

  const openModal = useCallback((id_: number) => {
    (async () => {
      if (id_ !== 0) {
        setId(id_);
        const response = await api.get<Speciality>('/specialities/' + id_);
        setFormData1(response.data);
      } else {
        setFormData1({ name: '', description: '' });
        setId(0);
      }
      setCreationError('');
      setSuccessMessage('');
      setIsModalOpen(true);
    })();
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSuccessMessage('');
  }, []);

  const resetErrors = () => {
    setErrors({});
  };

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      resetErrors();

      try {
        await api.post<Speciality>('/specialities', {
          id,
          ...formData1
        });

        const response = await api.get<Speciality[]>('/specialities');
        setSpecialities(response.data);

        setSuccessMessage('Especialidade salva com sucesso!');

        setTimeout(() => {
          closeModal();
        }, 2000); // Fechar o modal após 2 segundos
      } catch (err: any) {
        if (err.response && err.response.status === 409) {
          setCreationError(err.response.data.detail);
        } else {
          setCreationError('Não foi possível cadastrar.');
        }
      }
    },
    [formData1, id, closeModal]
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
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {dataPaginated.length > 0 ? (
              dataPaginated.map(speciality => (
                <tr key={speciality.id}>
                  <td>{speciality.name}</td>
                  <td>{speciality.description}</td>
                  <td>
                    <Button
                      type="button"
                      style={{ minWidth: '30px' }}
                      size="small"
                      onClick={() => openModal(speciality.id)}
                    >
                      <FaPlus />
                      Ver mais
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td align="center" colSpan={3}>
                  Nenhuma especialidade até o momento
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Controles de Paginação */}
        {totalPages > 1 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '20px',
              gap: '10px'
            }}
          >
            <Button
              type="button"
              size="small"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              <FaChevronLeft /> Anterior
            </Button>
            <span>
              Página {page} de {totalPages}
            </span>
            <Button
              type="button"
              size="small"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Próxima <FaChevronRight />
            </Button>
          </div>
        )}
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
        {successMessage && (
          <p style={{ color: 'green', textAlign: 'center', marginTop: '10px' }}>
            {successMessage}
          </p>
        )}
      </Modal>
    </Container>
  );
};

export default Dashboard;
