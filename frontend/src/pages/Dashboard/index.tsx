import React, { useCallback, useEffect, useState } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';
import Modal from 'react-modal';
import { useHistory } from "react-router-dom";
import Button from '../../components/Button';
import CreateAppointmentForm from '../../components/CreateAppointmentForm';
import Input from '../../components/Input';
import Navbar from '../../components/Navbar';
import SelectInput from '../../components/SelectInput';
import Title from '../../components/Title';
import Appointment from '../../models/Appointment';
import Doctor from '../../models/Doctor';
import Speciality from '../../models/Speciality';
import User from '../../models/User';
import api from '../../services/api';
import { Box, BoxHeader, Container, ModalStyle, TextModal, buttonStyles, filterContainer, inputGroup } from './styles';

Modal.setAppElement('#root');

function getAppointmentDate(appointment: Appointment): Date {
  const [hours, minutes] = appointment.time.split(':');
  const date = new Date(appointment.date);

  date.setHours(parseInt(hours));
  date.setMinutes(parseInt(minutes));

  return date;
}

const Dashboard: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialities, setSpecialities] = useState<Speciality[]>([]);
  const [patients, setPatients] = useState<User[]>([]);

  const [onCanceling, setOnCanceling] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const history = useHistory();

  const [filter, setFilter] = useState({
    speciality: '',
    doctor: '',
    date_start: new Date().toISOString().slice(0, 10),
    // add + 10 days
    date_end: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  });

  const [isDoctor, setIsDoctor] = useState(false);

  useEffect(() => {
    (async () => {
      const response = await api.get<Appointment[]>('/appointments', {
        params: filter
      });
      setAppointments(response.data);

      const doctorsResponse = await api.get<Doctor[]>('/doctors');
      setDoctors(doctorsResponse.data);

      const specialitiesResponse = await api.get<Speciality[]>('/specialities');
      setSpecialities(specialitiesResponse.data);

      const patientsResponse = await api.get<User[]>('/users');
      setPatients(patientsResponse.data);

      let storedUserString = localStorage.getItem('Medicar@auth_user');
      if (storedUserString) {
        try {
          let storedUser = JSON.parse(storedUserString);
          if (storedUser && storedUser.crm) {
            setIsDoctor(true);
          }
        } catch (e) {
          console.error('Error parsing stored user:', e);
        }
      }
    })();
  }, []);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleCancelAppointment = useCallback(
    async appointmentId => {
      setOnCanceling([...onCanceling, appointmentId]);

      await api.delete(`/appointments/${appointmentId}`);

      setAppointments(
        appointments.filter(appointment => appointment.id !== appointmentId),
      );
      setOnCanceling(onCanceling.filter(id => id !== appointmentId));
    },
    [appointments, onCanceling],
  );

  const onCancelingAppointment = useCallback(
    appointmentId => {
      return onCanceling.includes(appointmentId);
    },
    [onCanceling],
  );

  const handleNewAppointment = useCallback(
    async () => {
      const response = await api.get<Appointment[]>('/appointments', {
        params: filter
      });
      setAppointments(response.data);

      closeModal();
    },
    [appointments, closeModal],
  );

  const createAnamnese = useCallback(() => {
    history.push("/anamneses");
  }, [history]);


  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [obs, setObs] = useState({
    id: '',
    content: ''
  });

  const [textareaContent, setTextareaContent] = useState('');

  const openNewModal = useCallback((appointment) => {

    setObs({
      id: appointment.id,
      content: appointment.observation || ''
    });

    setTextareaContent(appointment.observation || '');

    setIsNewModalOpen(true);
  }, []);

  const closeNewModal = useCallback(() => {
    setIsNewModalOpen(false);
    setTextareaContent(''); // Limpa o conteúdo do textarea ao fechar o modal
  }, []);

  const handleSave = useCallback(async () => {
    // Adicione aqui a lógica para salvar as informações
    console.log('Salvando:', textareaContent);

    // Atualize o estado com as informações do modal
    setObs({
      id: obs.id,
      content: textareaContent
    });

    const response = await api.post('/appointments/obs/' + obs.id, {
      content: textareaContent
    });


    // Limpe o textarea
    setTextareaContent('');


    // Feche o modal após salvar, se necessário
    closeNewModal();
  }
    , []);


  const serach = useCallback(async () => {

    const response = await api.get<Appointment[]>('/appointments', {
      params: filter
    });
    setAppointments(response.data);
  }, [filter]); // add filter as a dependency

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = event.target;

      setFilter((prevData) => ({ ...prevData, [name]: value }));
    },
    [setFilter]
  );

  // call serach whenever filter changes
  useEffect(() => {
    serach();
  }, [serach]);

  return (
    <Container>
      <Navbar />
      <Box>
        <BoxHeader>
          <Title>Consultas</Title>
          <Button type="button" size="small" onClick={openModal}>
            <FaPlus />
            Nova Consulta
          </Button>
        </BoxHeader>

        <div style={filterContainer}>
          <div style={inputGroup}>

            {isDoctor ? (
                <SelectInput
                  style={{ width: '175px' }}
                  options={patients.map(patient => ({ label: patient.name, value: patient.id }))}
                  onChange={handleInputChange}
                  name='patient'
                />
            ) : (
              <>
                <SelectInput
                  style={{ width: '175px' }}
                  options={specialities.map(speciality => ({ label: speciality.name, value: speciality.id }))}
                  onChange={handleInputChange}
                  name='speciality'
                />
                <SelectInput
                  style={{ width: '175px' }}
                  options={doctors.map(doctor => ({ label: doctor.name, value: doctor.id }))}
                  onChange={handleInputChange}
                  name='doctor'
                />
              </>
            )}

            
            
          </div>
          <div style={inputGroup}>
            <Input
              style={{ maxWidth: '110px' }}
              type="date"
              placeholder="Data"
              onChange={handleInputChange}
              name='date_start'
            />
            <Input
              type="date"
              placeholder="Data"
              onChange={handleInputChange}
              name='date_end'
            />
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Especialidade</th>
              <th>Profissional</th>
              <th>Data</th>
              <th>Hora</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {appointments.length > 0 ? (
              appointments.map(appointment => (
                <tr key={appointment.id}>
                  <td>{appointment.doctor.speciality.name}</td>
                  <td>{appointment.doctor.name}</td>
                  <td>{new Date(appointment.date).toLocaleDateString()}</td>
                  <td>{appointment.time}</td>
                  <td>
                    <Button type="button" style={{ width: '150px' }} size="small" onClick={() => openNewModal(appointment)}>
                      <FaPlus />
                      Obs.
                    </Button>
                    <Button type="button" style={{ width: '150px', marginTop: '5px' }} size="small" onClick={createAnamnese}>
                      <FaPlus />
                      Nova Anamnese
                    </Button>
                    <Button
                      style={{ marginTop: '5px', width: '150px' }}
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
        <CreateAppointmentForm
          onCreateSuccess={handleNewAppointment}
          onCancel={closeModal}
        />
      </Modal>

      <Modal
        isOpen={isNewModalOpen}
        shouldCloseOnOverlayClick={true}
        onRequestClose={closeNewModal}
        style={TextModal}
      >
        <div>
          <h2 style={{ paddingBottom: '30px' }}>Observação</h2>
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
            <Button type="button" onClick={handleSave} style={buttonStyles}>
              Salvar
            </Button>
          </BoxHeader>
        </div>
      </Modal>

    </Container>
  );
};

export default Dashboard;