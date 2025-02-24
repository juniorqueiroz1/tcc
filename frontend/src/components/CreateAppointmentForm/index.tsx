import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import Appointment from '../../models/Appointment';
import Doctor from '../../models/Doctor';
import DoctorSchedule from '../../models/DoctorSchedule';
import Speciality from '../../models/Speciality';
import api from '../../services/api';
import Alert from '../Alert';
import Button from '../Button';
import Input from '../Input';
import SelectInput from '../SelectInput';
import Title from '../Title';
import { Container, Form, FormActions } from './styles';
import { useField } from './utils';

interface CreateAppointmentFormProps {
  onCreateSuccess?: (appointment: Appointment) => void;
  onCancel?: () => void;
  isDoctor?: boolean;
}

const CreateAppointmentForm: React.FC<CreateAppointmentFormProps> = ({
  onCreateSuccess,
  onCancel,
  isDoctor,
}) => {
  const timeField = useField({});

  const weekDays = [
    { value: 'monday', label: 'Segunda-feira' },
    { value: 'tuesday', label: 'Terça-feira' },
    { value: 'wednesday', label: 'Quarta-feira' },
    { value: 'thursday', label: 'Quinta-feira' },
    { value: 'friday', label: 'Sexta-feira' },
    { value: 'saturday', label: 'Sábado' },
    { value: 'sunday', label: 'Domingo' },
    
  ];

  // let showDate = true;
  const [showDate, setShowDate] = useState(true);

  const scheduleField = useField({
    dependant: [timeField],
    resolve: _filterTimesBySchedule,
  });

  const doctorField = useField({
    dependant: [timeField, scheduleField],
    resolve: _filterSchedulesByDoctor,
  });

  const specialityField = useField({
    dependant: [timeField, scheduleField, doctorField],
    resolve: _filterDoctorsBySpeciality,
  });

  const patientField = useField({});
  const [patients, setPatients] = useState<{ value: string; label: string }[]>([]);

  const [schedules, setSchedules] = useState<DoctorSchedule[]>([]);
  const [creationError, setCreationError] = useState('');

  async function _filterSpecialities() {
    const response = await api.get<Speciality[]>('/specialities');

    specialityField.setOptions(
      response.data.map(({ id: value, name: label }) => ({
        value,
        label,
      })),
    );
  }

  async function _filterDoctorsBySpeciality(speciality: string) {
    const response = await api.get<Doctor[]>('/doctors', {
      params: { speciality },
    });

    doctorField.setOptions(
      response.data.map(({ id: value, name: label }) => ({ value, label })),
    );

    setShowDate(false);
  }


  async function _filterSchedulesByDoctor(doctor: string) {
    const response = await api.get<DoctorSchedule[]>('/doctor-schedules/' + doctor);

    setSchedules(response.data);
  }

   async function _filterTimesBySchedule(date: string) {
    if (!doctorField.value && !isDoctor) return;
    try {
      // Se for médico, o id do doctor vem do token; caso contrário, utiliza o doctorField
      let doctorId = isDoctor ? '' : doctorField.value;

      if(isDoctor) {
        let storedUserString = localStorage.getItem('Medicar@auth_user');
        if (storedUserString) {
          try {
            let storedUser = JSON.parse(storedUserString);
            if (storedUser && storedUser.crm) {
              doctorId = storedUser.id;
            }
          } catch (e) {
            console.error('Error parsing stored user:', e);
          }
        }
      }

      const endpoint = `/doctors/${doctorId}/available-times`;

      const response = await api.get(endpoint, {
        params: { date },
      });
      const options = response.data.map((time: string) => ({
        value: time,
        label: time,
      }));
      timeField.setOptions(options);
    } catch (error) {
      console.error('Erro ao buscar horários disponíveis:', error);
      timeField.setOptions([]);
    }
  }


  // Se o usuário for médico, busca a lista de pacientes
  useEffect(() => {
    if (isDoctor) {
      api.get('/users')
        .then(response => {
          const options = response.data.map((patient: any) => ({
            value: patient.id,
            label: patient.name,
          }));
          setPatients(options);
          patientField.setOptions(options);
        })
        .catch(error => console.error('Erro ao buscar pacientes:', error));
    }
  }, [isDoctor]);

  // Reseta os campos do formulário (ajuste se necessário)
  const resetForm = useCallback(() => {
    if (isDoctor) {
      patientField.reset();
    } else {
      specialityField.reset();
      doctorField.reset();
      scheduleField.reset();
    }
    timeField.reset();
  }, [isDoctor, patientField, specialityField, doctorField, scheduleField, timeField]);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setCreationError('');

      try {
        let payload: any = {
          time: timeField.value,
        };

        if (isDoctor) {
          // Se for médico, o médico logado já vem do token (request.user)
          // e deve ser associado à consulta automaticamente;
          // aqui, envia também o paciente selecionado e a data desejada.
          payload.date = scheduleField.value; // ou outro campo de data se aplicável
          payload.patient = patientField.value;
        } else {
          // Para usuário não médico, utiliza os campos já existentes:
          payload.date = scheduleField.value;
          payload.doctor = doctorField.value;
        }

        const { data: appointment } = await api.post<Appointment>('/appointments', payload);

        if (onCreateSuccess) {
          onCreateSuccess(appointment);
        }
      } catch (err: any) {
        if (err.response && err.response.status === 409) {
          const { detail } = err.response.data;
          setCreationError(detail);
        } else {
          setCreationError('Não foi possível marcar a consulta.');
        }
      }
    },
    [
      isDoctor,
      timeField.value,
      scheduleField.value,
      doctorField.value,
      patientField.value,
      onCreateSuccess,
    ],
  );


  const handleCancelAppointment = useCallback(() => {
    resetForm();

    if (onCancel) {
      onCancel();
    }
  }, [onCancel, resetForm]);

  // const handleChangeWeekDay = useCallback(
  //   (event: FormEvent<HTMLInputElement>) => {
  //     const { value } = event.currentTarget;

  //     // get the weekday
  //     const date = new Date(value);
  //     const weekday = weekDays[date.getDay()].value;
  //     console.log("weekday", weekday);

  //     _filterTimesBySchedule(weekday);
  //   },
  //   [],
  // );

  useEffect(() => {
    if (!isDoctor) {
      _filterSpecialities();
    }
  }, [isDoctor]);
  
  return (
    <Container>
      <Title>Nova Consulta</Title>
      <Form onSubmit={handleSubmit}>
        {creationError && <Alert>{creationError}</Alert>}

        {isDoctor ? (
          <>
            <SelectInput
              required
              placeholder="Paciente"
              name="patient"
              options={patientField.options || patients}
              onChange={patientField.handleChange}
            />
            <Input
              required
              placeholder="Data"
              name="schedule"
              type="date"
              style={{ marginTop: 16 }}
              onChange={scheduleField.handleChange}
            />
          </>
        ) : (
          // Se não for, mantém os campos originais
          <>
            <SelectInput
              required
              placeholder="Especialidade"
              name="speciality"
              disabled={!specialityField.options.length}
              options={specialityField.options}
              onChange={specialityField.handleChange}
            />
            <SelectInput
              required
              placeholder="Médico"
              name="doctor"
              disabled={!doctorField.options.length}
              options={doctorField.options}
              onChange={doctorField.handleChange}
            />
            <Input
              required
              placeholder="Data"
              name="schedule"
              type="date"
              style={{ marginTop: 16 }}
              onChange={scheduleField.handleChange}
            />
          </>
        )}

        <SelectInput
          required
          placeholder="Horário"
          name="time"
          disabled={!timeField.options.length}
          options={timeField.options}
          onChange={timeField.handleChange}
        />

        <FormActions>
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancelAppointment}
          >
            Cancelar
          </Button>

          <Button type="submit" disabled={!timeField.value}>
            Confirmar
          </Button>
        </FormActions>
      </Form>
    </Container>
  );
};

export default CreateAppointmentForm;
