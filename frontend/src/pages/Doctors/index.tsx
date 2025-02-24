import React, { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaPlus, FaTimes } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';
import Link from '../../components/Link';
import Navbar from '../../components/Navbar';
import Title from '../../components/Title';
import Doctor from '../../models/Doctor';
import api from '../../services/api';
import { Box, BoxHeader, Button, Container, Pagination } from './styles';

const DoctorIndex: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [page, setPage] = useState(1);
  const limit = 5; // Número de médicos por página
  const history = useHistory();

  // Busca todos os médicos ao carregar a página
  useEffect(() => {
    (async () => {
      try {
        const response = await api.get('/doctors'); // Pega TODOS os médicos de uma vez
        if (response.data && Array.isArray(response.data)) {
          setDoctors(response.data);
        } else {
          setDoctors([]); // Evita erro se o formato da resposta for inesperado
        }
      } catch (error) {
        console.error("Erro ao buscar médicos:", error);
        setDoctors([]);
      }
    })();
  }, []);

  // Calcula o número total de páginas
  const totalPages = Math.ceil(doctors.length / limit);

  // Obtém os médicos da página atual
  const doctorsPaginated = doctors.slice((page - 1) * limit, page * limit);

  return (
    <Container>
      <Navbar />
      <Box>
        <BoxHeader>
          <Title>Médicos</Title>
          <Link onClick={() => history.push('/doctors/create')}>
            <FaPlus />
            Novo Médico
          </Link>
        </BoxHeader>

        <table>
          <thead>
            <tr>
              <th>Especialidade</th>
              <th>Nome</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {doctorsPaginated.length > 0 ? (
              doctorsPaginated.map((doctor) => (
                <tr key={doctor.id}>
                  <td>{doctor.speciality.name}</td>
                  <td>{doctor.name}</td>
                  <td>
                    <Button
                      type="button"
                      onClick={() => history.push(`/doctors/edit/${doctor.id}`)}
                    >
                      <FaTimes />
                      Editar
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td align="center" colSpan={3}>
                  Nenhum médico encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* PAGINAÇÃO */}
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

export default DoctorIndex;
