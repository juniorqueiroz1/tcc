import React, { useCallback, useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useParams } from 'react-router-dom';
import Button from '../../components/Button';
import { useField } from '../../components/CreateAnamnesisForm/utils';
import Navbar from '../../components/Navbar';
import Title from '../../components/Title';
import Doctor from '../../models/Doctor';
import DoctorSchedule from '../../models/DoctorSchedule';
import Speciality from '../../models/Speciality';
import api from '../../services/api';
import { Box, BoxHeader, Container, ErrorMessage, Form, Input, Select, TabsButton } from './styles';
Modal.setAppElement('#root');

interface DoctorCreateProps {
  doctor_id: number;
}

interface Errors {
  name?: string; // Allow optional errors
  crm?: string;
  fone?: string;
  email?: string;
  specialityId?: string;
  doctor?: string;
  weekday?: string;
  startTime?: string;
  endTime?: string;
  [key: string]: string | undefined; // Allow any additional errors
}

const DoctorCreate: React.FC = () => {
  const params = useParams<{ doctor_id: string }>();

  const [activeTab, setActiveTab] = useState(1);

  const initialFormData1 = {
    name: '',
    crm: '',
    phone: '',
    email: '',
    specialityId: '',
    password: '',
  };

  const initialFormData2 = {
    doctor: '',
    weekday: '',
    startTime: '',
    endTime: ''
  };

  let erros = {} as Errors;
  const [errors, setErrors] = useState<Errors>({});

  const [creationError, setCreationError] = useState('');


  const [formData1, setFormData1] = useState(initialFormData1);
  const [formData2, setFormData2] = useState(initialFormData2);

  const [specialities, setSpecialities] = useState<Speciality[]>([]);
  const [doctorSchedules, setDoctorSchedules] = useState<DoctorSchedule[]>([]);

  const handleTabChange = (tabNumber: number) => {
    setActiveTab(tabNumber);
  };

  const timeField = useField({});



  useEffect(() => {
    (async () => {
      // const response = await api.get<Doctor[]>(`/doctor/${doctor_id}`);
      const doctor_id = params.doctor_id;
      console.log(doctor_id);
      if (doctor_id) {
        const response = await api.get(`/doctors/${doctor_id}`);
        const convertedCrm = String(response.data.crm);

        setFormData1(response.data)

        const doctorSchedules_ = await api.get<DoctorSchedule[]>('/doctor-schedules/' + doctor_id);
        setDoctorSchedules(doctorSchedules_.data);
      }

      const specialities_ = await api.get<Speciality[]>('/specialities');

      

      setSpecialities(specialities_.data);

      

    }
    )();
  }
    , []);



  const resetErrors = () => {
    setErrors({});
    setCreationError('');
  };


  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = event.target;

      if (activeTab === 1) {
        setFormData1((prevData) => ({ ...prevData, [name]: value }));
      } else {
        console.log("formData2");
        setFormData2((prevData) => ({ ...prevData, [name]: value }));
      }
    },
    [activeTab, setFormData1, setFormData2]
  );

  
  

  const handleSubmit = useCallback(
    async (event) => {
      try {
        event.preventDefault();

        resetErrors();
        console.log(formData1);

        const req = await api.post<Doctor>(
          '/doctors',
          {
            doctorId: params.doctor_id,
            time: timeField.value,
            ...formData1
          },
        );

        console.log(formData2);
        // verificar se os campos do formdata2 estão preenchidos
        if (formData2.weekday && formData2.startTime && formData2.endTime) {
          console.log("formData2");
          const req2 = await api.post<DoctorSchedule>(
            '/doctor-schedules',
            {
              doctorId: req.data.id,
              time: timeField.value,
              ...formData2
            },
          );
        }

        

      } catch (err: any) {
        if (err.response && err.response.status === 409) {
          const { detail } = err.response.data;
          setCreationError(detail);
        } 
        else if (err.response && err.response.status === 400) {
          const { data } = err.response;
          const errors_: Errors = {};
          for (const key in data) {
            errors_[key] = data[key][0];
          }
          erros = errors_;
        }

        else {
          setCreationError('Não foi possível marcar a consulta.');
        }
      }

      setErrors(erros);

    },
    [formData1, formData2, timeField]
  );

  const renderForm = () => {
    if (activeTab === 1) {
      return (
        <>
          <Input
            type="text"
            name="name"
            placeholder="Nome"
            style={{ marginBottom: '10px' }}
            value={formData1.name}
            onChange={handleInputChange}
          />
        {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}

          <Input
            type="number"
            name="crm"
            placeholder="CRM"
            style={{ marginBottom: '10px' }}
            value={formData1.crm}
            onChange={handleInputChange}
          />
          {errors.crm && <ErrorMessage>{errors.crm}</ErrorMessage>}
          <Input
            type="number"
            name="phone"
            placeholder="Telefone"
            style={{ marginBottom: '10px' }}
            value={formData1.phone}
            onChange={handleInputChange}
          />
          {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
          <Input
            type="text"
            name="email"
            placeholder="Email"
            style={{ marginBottom: '10px' }}
            value={formData1.email}
            onChange={handleInputChange}
          />
          {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
          <Input
            type="text"
            name="password"
            placeholder="Senha"
            style={{ marginBottom: '10px' }}
            onChange={handleInputChange}
          />
          {errors.email && <ErrorMessage>{errors.password}</ErrorMessage>}
          <Select
            name="specialityId"
            placeholder="Especialidade"
            style={{ marginBottom: '10px' }}
            value={formData1.specialityId}
            onChange={handleInputChange}
          >
            <option value="">Selecione uma especialidade</option>
            {specialities.map(speciality => (
              <option key={speciality.id} value={speciality.id}>
                {speciality.name}
              </option>
            ))}
          </Select>
          {errors.specialityId && <ErrorMessage>{errors.specialityId}</ErrorMessage>}
        </>
      );
    } else {
      return (
        <>
          <Select
            name="weekday"
            placeholder="Dia da semana"
            style={{ marginBottom: '10px' }}
            value={formData2.weekday}
            onChange={handleInputChange}
          >
            <option value="">Selecione um dia da semana</option>
            <option value="sunday">Domingo</option>
            <option value="monday">Segunda-feira</option>
            <option value="tuesday">Terça-feira</option>
            <option value="wednesday">Quarta-feira</option>
            <option value="thursday">Quinta-feira</option>
            <option value="friday">Sexta-feira</option>
            <option value="saturday">Sábado</option>
          </Select>
          <Input
            type="number"
            name="startTime"
            placeholder="Hora de início"
            style={{ marginBottom: '10px' }}
            value={formData2.startTime}
            onChange={handleInputChange}
          />
          <Input
            type="number"
            name="endTime"
            placeholder="Hora de término"
            style={{ marginBottom: '10px' }}
            value={formData2.endTime}
            onChange={handleInputChange}
          />
        </>
      );
    }
  };

  return (
    <Container>
      <Navbar />
      <Box>
        <BoxHeader>
          <Title>Cadastrar Médico</Title>
        </BoxHeader>

        <div>
          <TabsButton onClick={() => handleTabChange(1)}>Médico</TabsButton>
          <TabsButton onClick={() => handleTabChange(2)}>Agenda</TabsButton>
        </div>

        <Form onSubmit={handleSubmit}>
          {renderForm()}
          <Button type="submit">
            {/* Cadastrar */}
            {params.doctor_id ? 'Editar' : 'Cadastrar'}
          </Button>
        </Form>

        {activeTab === 2 && 
          <table>
            <thead>
              <tr>
                <th>Dia</th>
                <th>Horário</th>
                <th></th>
              </tr>

              
            </thead>
            <tbody>
              {doctorSchedules.length > 0 ? (
                doctorSchedules.map(schedule => (
                  <tr key={schedule.id}>
                    <td>{schedule.weekday}</td>
                    <td>{schedule.startTime} - {schedule.endTime}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td align="center" colSpan={5}>
                    Nenhum medico até o momento
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          }
      </Box>
    </Container>
  );
};

export default DoctorCreate;
