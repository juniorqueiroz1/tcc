import React, { useCallback, useEffect, useState } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';
import Modal from 'react-modal';
import { useHistory } from "react-router-dom";
import Link from '../../components/Link';
import Navbar from '../../components/Navbar';
import Title from '../../components/Title';
import Doctor from '../../models/Doctor';
import api from '../../services/api';
import { Box, BoxHeader, Button, Container } from './styles';

Modal.setAppElement('#root');

const DoctorIndex: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [onCanceling, setOnCanceling] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const history = useHistory();


  useEffect(() => {
    (async () => {
      const response = await api.get<Doctor[]>('/doctors');

      setDoctors(response.data);
    })();
  }, []);




  // redirect to create file
  const create = useCallback(() => {
    history.push("/doctors/create");
  }, [history]);


  return (
    <Container>
      <Navbar />
      <Box>
        <BoxHeader>
          <Title>Médicos</Title>
          <Link onClick={create}>
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

            {doctors.length > 0 ? (
              doctors.map(doctor => (
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
                <td align="center" colSpan={5}>
                  Nenhum medico até o momento
                </td>
              </tr>
            )}
          </thead>
          <tbody>
            {/* {appointments.length > 0 ? (
              appointments.map(appointment => (
                <tr key={appointment.id}>
                  <td>{appointment.doctor.speciality.name}</td>
                  <td>{appointment.doctor.name}</td>
                  <td>{new Date(appointment.date).toLocaleDateString()}</td>
                  <td>{appointment.time}</td>
                  <td>
                    <Button
                      type="button"
                      variant="secondary"
                      size="small"
                      disabled={onCancelingAppointment(appointment.id)}
                      onClick={() => handleCancelAppointment(appointment.id)}
                    >
                      <FaTimes />
                      Desmarcar
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td align="center" colSpan={5}>
                  Nenhuma consulta marcada até o momento
                </td>
              </tr>
            )} */}
          </tbody>
        </table>
      </Box>
    </Container>
  );
};

export default DoctorIndex;
