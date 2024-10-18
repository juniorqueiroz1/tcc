import React, { useCallback, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import Modal from 'react-modal';
import { useHistory } from "react-router-dom";
import Link from '../../components/Link';
import Navbar from '../../components/Navbar';
import Title from '../../components/Title';
import Appointment from '../../models/Appointment';
import { Box, BoxHeader, Container, ModalStyles } from './styles';
import Button from '../../components/Button';
import CreateAnamnesisForm from '../../components/CreateAnamnesisForm';

Modal.setAppElement('#root');

const AnamneseIndex: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [onCanceling, setOnCanceling] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
   const history = useHistory();

  // redirect to create file
  const createAppointment = useCallback(() => {
    // history.push("/doctors/create");
  }, [history]);
  
  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);
  
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleNewAppointment = useCallback(
    (appointment: Appointment) => {
      const sortedAppointments = [...appointments, appointment].sort((a, b) => {
        return (
          getAppointmentDate(a).getTime() - getAppointmentDate(b).getTime()
        );
      });

      setAppointments(sortedAppointments);
      closeModal();
    },
    [appointments, closeModal],
  );

  function getAppointmentDate(appointment: Appointment): Date {
    const [hours, minutes] = appointment.time.split(':');
    const date = new Date(appointment.date);
  
    date.setHours(parseInt(hours));
    date.setMinutes(parseInt(minutes));
  
    return date;
  }

  return (
    <Container>
      <Navbar />
      <Box>
        <BoxHeader>
          <Title>Anamneses</Title>
          <Link onClick={openModal}>
            <FaPlus />
            Nova Anamnese
          </Link>
        </BoxHeader>

        <Modal
        isOpen={isModalOpen}
        shouldCloseOnOverlayClick={true}
        onRequestClose={closeModal}
        style={ModalStyles}
      >
        <CreateAnamnesisForm
          onCreateSuccess={handleNewAppointment}
          onCancel={closeModal}
        />
      </Modal>

        <table>
          <thead>
            <tr>
              <th>Anamnese</th>
              <th>Data</th>
              <th>Hora</th>
              <th></th>
            </tr>
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

export default AnamneseIndex;
