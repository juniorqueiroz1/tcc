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
  const [successMessage, setSuccessMessage] = useState('');

  const [missingDoctorData, setMissingDoctorData] = useState(false); // Estado para aviso na aba "Agenda"

  // Objeto de mapeamento para traduzir os erros de validação
  const errorMessages: Record<string, string> = {
    name: 'Nome é obrigatório.',
    crm: 'CRM é obrigatório.',
    phone: 'Telefone é obrigatório.',
    email: 'E-mail é obrigatório.',
    password: 'Senha é obrigatória.',
    specialityId: 'Especialidade é obrigatória.',
    weekday: 'Dia da semana é obrigatório.',
    startTime: 'Hora de início é obrigatória.',
    endTime: 'Hora de término é obrigatória.',
  };


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
  const [currentDoctorId, setCurrentDoctorId] = useState<string | null>(params.doctor_id || null);

  const handleTabChange = (tabNumber: number) => {
    setActiveTab(tabNumber);
  };

  const timeField = useField({});

  const diasSemana: Record<string, string> = {
    sunday: 'Domingo',
    monday: 'Segunda-feira',
    tuesday: 'Terça-feira',
    wednesday: 'Quarta-feira',
    thursday: 'Quinta-feira',
    friday: 'Sexta-feira',
    saturday: 'Sábado',
  };

  useEffect(() => {
    (async () => {
      // const response = await api.get<Doctor[]>(`/doctor/${doctor_id}`);
      const doctor_id = params.doctor_id;
      console.log(doctor_id);
      if (doctor_id) {
        const response = await api.get(`/doctors/${doctor_id}`);
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

  useEffect(() => {
    (async () => {
      if (currentDoctorId) {
        const response = await api.get(`/doctors/${currentDoctorId}`);
        setFormData1({ ...response.data, password: '' });
        const schedules = await api.get<DoctorSchedule[]>(`/doctor-schedules/${currentDoctorId}`);
        setDoctorSchedules(schedules.data);
      }
      const specialities_ = await api.get<Speciality[]>('/specialities');
      setSpecialities(specialities_.data);
    })();
  }, [currentDoctorId]);

  const resetErrors = () => {
    setErrors({});
    setCreationError('');
    setMissingDoctorData(false);
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

  
  const deleteSchedule = async (scheduleId: number) => {
    if (!window.confirm('Deseja realmente excluir este horário?')) {
      return;
    }
    try {
      await api.delete(`/doctor-schedules/${scheduleId}`);
      setDoctorSchedules(prev => prev.filter(schedule => schedule.id !== scheduleId));
    } catch (error) {
      console.error('Erro ao excluir horário:', error);
    }
  };

  const handleSubmit = useCallback(
    async (event) => {
      try {
        event.preventDefault();
        resetErrors();
        
        if (!formData1.name || !formData1.crm || !formData1.phone || !formData1.email || !formData1.specialityId || (!currentDoctorId && !formData1.password) ) {
          setMissingDoctorData(true);
          throw new Error('missing_doctor_data');
        }

        let doctor_id = params.doctor_id || currentDoctorId;

        // Cadastra o médico
        const response  = await api.post<Doctor>('/doctors', {
          doctorId: doctor_id,
          time: timeField.value,
          ...formData1
        });

        // Atualize o ID do médico após a criação
        if (!currentDoctorId) {
          setCurrentDoctorId(response.data.id.toString());
        }

        let newSchedule = null;

        // Se os dados da agenda estiverem preenchidos, cadastra o horário
        if (formData2.weekday && formData2.startTime && formData2.endTime) {
          const req2 = await api.post<DoctorSchedule>('/doctor-schedules', {
            doctorId: currentDoctorId || response.data.id,
            time: timeField.value,
            ...formData2
          });

          newSchedule = req2.data;
        }

        setSuccessMessage(currentDoctorId ? 'Médico atualizado com sucesso!' : 'Médico cadastrado com sucesso!');

        // Atualizar a lista de agendas
        if (newSchedule) {
          setDoctorSchedules(prev => [...prev, newSchedule]);
        }

        // if (newSchedule) {
        //   setDoctorSchedules((prevSchedules) => [...prevSchedules, newSchedule]);
        // }
        
        // if (!params.doctor_id) {
        //   setFormData1(initialFormData1);
        //   setFormData2(initialFormData2);
        // }
      } catch (err: any) {
        if (err.message === 'missing_doctor_data') {
          setCreationError('Atenção! Dados do médico não preenchidos.');
        } else if (err.response && err.response.status === 400) {
          const { data } = err.response;
          const errors_: Errors = {};
          for (const key in data) {
            errors_[key] = errorMessages[key] || 'Campo obrigatório.';
          }
          setErrors(errors_);
        } else {
          setCreationError('Não foi possível cadastrar o médico.');
        }
      }
    },
    [formData1, formData2, currentDoctorId, timeField]
  );


  const renderForm = () => {
    if (activeTab === 1) {
      return (
        <>
          {missingDoctorData && (
            <ErrorMessage>Atenção! Dados do médico não preenchidos.</ErrorMessage>
          )}
          <Input
            type="text"
            name="name"
            placeholder="Nome"
            style={{ marginBottom: '10px' }}
            value={formData1.name}
            onChange={handleInputChange}
          />
          <Input
            type="number"
            name="crm"
            placeholder="CRM"
            style={{ marginBottom: '10px' }}
            value={formData1.crm}
            onChange={handleInputChange}
          />
          <Input
            type="number"
            name="phone"
            placeholder="Telefone"
            style={{ marginBottom: '10px' }}
            value={formData1.phone}
            onChange={handleInputChange}
          />
          <Input
            type="text"
            name="email"
            placeholder="Email"
            style={{ marginBottom: '10px' }}
            value={formData1.email}
            onChange={handleInputChange}
          />
          <Input
            type="text"
            name="password"
            placeholder="Senha"
            style={{ marginBottom: '10px' }}
            onChange={handleInputChange}
          />
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
        </>
      );
    } else {
      return (
        <>
          {missingDoctorData && (
            <ErrorMessage>Atenção! Dados do médico não preenchidos.</ErrorMessage>
          )}
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
          <Title>{currentDoctorId ? 'Editar Médico' : 'Cadastrar Médico'}</Title>
        </BoxHeader>

        <div>
          <TabsButton onClick={() => handleTabChange(1)}>Médico</TabsButton>
          <TabsButton onClick={() => handleTabChange(2)}>Agenda</TabsButton>
        </div>

        <Form onSubmit={handleSubmit}>
          {renderForm()}
          <Button type="submit">
            {/* Cadastrar */}
            {currentDoctorId  ? 'Salvar' : 'Cadastrar'}
          </Button>
        </Form>

         {/* Exibe mensagem de erro de criação, se houver */}
        {creationError && <ErrorMessage>{creationError}</ErrorMessage>}

        {/* Exibe mensagem de sucesso, se houver */}
        {successMessage && <div style={{ color: 'green', marginTop: '10px' }}>{successMessage}</div>}

{activeTab === 2 && (
  <table>
    <thead>
      <tr>
        <th>Dia</th>
        <th style={{ textAlign: 'center' }}>Horários</th>
      </tr>
    </thead>
    <tbody>
      {doctorSchedules.length > 0 ? (
        Object.entries(
          doctorSchedules.reduce<Record<string, { id: number; timeRange: string }[]>>((acc, schedule) => {
            const day = diasSemana[schedule.weekday] || schedule.weekday;
            const formattedStartTime = schedule.startTime.padStart(2, '0') + ":00";
            const formattedEndTime = schedule.endTime.padStart(2, '0') + ":00";
            const timeRange = `${formattedStartTime} - ${formattedEndTime}`;
            
            if (!acc[day]) {
              acc[day] = [];
            }
            acc[day].push({ id: schedule.id, timeRange });

            return acc;
          }, {})
        ).map(([day, schedules]) => (
          <tr key={day}>
            <td>{day}</td>
            <td>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                {schedules.map(s => (
                  <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span 
                      style={{
                        fontSize: '12px',
                        color: 'red',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                      onClick={() => deleteSchedule(s.id)}
                    >
                      ✖
                    </span>
                    {s.timeRange}
                  </div>
                ))}
              </div>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td align="center" colSpan={3}>Nenhum horário cadastrado</td>
        </tr>
      )}
    </tbody>
  </table>
)}


      </Box>
    </Container>
  );
};

export default DoctorCreate;
