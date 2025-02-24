import React, { useCallback, useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import Modal from 'react-modal';
import { useParams } from 'react-router-dom';
import Button from '../../components/Button';
import CreateAnamnesisForm from '../../components/CreateAnamnesisForm';
import Navbar from '../../components/Navbar';
import Title from '../../components/Title';
import api from '../../services/api';
import { Box, BoxHeader, Container, ModalStyles, Pagination } from './styles';

Modal.setAppElement('#root');

const AnamneseIndex: React.FC = () => {
  const { appointment_id } = useParams<{ appointment_id: string }>();
  const [anamneses, setAnamneses] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnamnesis, setSelectedAnamnesis] = useState<any | null>(null);
  const [page, setPage] = useState(1);

  const limit = 5; // Número de médicos por página
    // Calcula o número total de páginas
  const totalPages = Math.ceil(anamneses.length / limit);

  // Obtém os médicos da página atual
  const dataPaginated = anamneses.slice((page - 1) * limit, page * limit);

  useEffect(() => {
    async function fetchAnamneses() {
      const response = await api.get(`/anamnese/${appointment_id}`);
      setAnamneses(response.data);
    }
    fetchAnamneses();
  }, [appointment_id]);

  const openModal = useCallback((anamnesis = null) => {
    setSelectedAnamnesis(anamnesis);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedAnamnesis(null);
  }, []);

  const handleAnamnesisUpdate = (anamnesis: any) => {
    setAnamneses((prev) => {
      const exists = prev.find((a) => a.id === anamnesis.id);
      return exists ? prev.map((a) => (a.id === anamnesis.id ? anamnesis : a)) : [...prev, anamnesis];
    });
    closeModal();
  };

  const handleDeleteAnamnesis = async (id: number) => {
    try {
      await api.delete(`/anamnese/${id}`);
      setAnamneses((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      console.error('Erro ao excluir anamnese:', error);
    }
  };

  return (
    <Container>
      <Navbar />
      <Box>
        <BoxHeader>
          <Title>Anamneses</Title>
          <Button onClick={() => openModal()}>
            <FaPlus /> Nova Anamnese
          </Button>
        </BoxHeader>

        <Modal isOpen={isModalOpen} shouldCloseOnOverlayClick onRequestClose={closeModal} style={ModalStyles}>
          <CreateAnamnesisForm
            appointmentId={appointment_id}
            anamnesis={selectedAnamnesis}
            onSaveSuccess={handleAnamnesisUpdate}
            onCancel={closeModal}
          />
        </Modal>

        <table>
          <thead>
            <tr>
              <th>Anamnese</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {dataPaginated.length > 0 ? (
              dataPaginated.map((anamnesis) => (
                <tr key={anamnesis.id}>
                  <td>{anamnesis.description}</td>
                  <td style={{ display: 'flex', gap: '8px' }}>
                    <Button type="button" variant="secondary" size="small" onClick={() => openModal(anamnesis)}>
                      <FaEdit /> Editar
                    </Button>
                    <Button type="button" variant="danger" size="small" onClick={() => handleDeleteAnamnesis(anamnesis.id)}>
                      <FaTrash /> Excluir
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td align="center" colSpan={2}>Nenhuma anamnese registrada.</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Paginação */}
        {totalPages > 1 && (
          <Pagination>
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>
              <FaChevronLeft /> Anterior
            </button>
            <span>Página {page} de {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
              Próxima <FaChevronRight />
            </button>
          </Pagination>
        )}
      </Box>
    </Container>
  );
};

export default AnamneseIndex;
