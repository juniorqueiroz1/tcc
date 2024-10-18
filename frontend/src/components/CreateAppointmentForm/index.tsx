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
}

const CreateAppointmentForm: React.FC<CreateAppointmentFormProps> = ({
  onCreateSuccess,
  onCancel,
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

    console.log("response.data", response.data);


    setSchedules(response.data);
  }

  function _filterTimesBySchedule(date: string) {
    console.log(schedules, date)
    // pegar o date "2023-12-12" e pegar o dia da semana
    const date_ = new Date(date);
    const weekday = weekDays[date_.getDay()].value;

    console.log("weekday", weekday);
    const schedule = schedules.find(
      schedule => weekday == schedule.weekday,
    );
    console.log(schedule);

    if (schedule) {
      let times = [];
      for (let i = Number(schedule.startTime); i < Number(schedule.endTime); i++) {

        let time_formated = i.toString().padStart(2, '0') + ':00';
        times.push({ value: time_formated, label: time_formated });
      }
      timeField.setOptions(times);
    }
  }

  const resetForm = useCallback(() => {
    specialityField.reset();
    doctorField.reset();
    scheduleField.reset();
    timeField.reset();
  }, [specialityField, doctorField, scheduleField, timeField]);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      try {
        event.preventDefault();

        setCreationError('');

        const { data: appointment } = await api.post<Appointment>(
          '/appointments',
          {
            date: scheduleField.value,
            time: timeField.value,
            doctor: doctorField.value,
          },
        );

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
    [scheduleField.value, timeField.value, onCreateSuccess],
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
    _filterSpecialities();
  }, []); // eslint-disable-line

  return (
    <Container>
      <Title>Nova Consulta</Title>
      <Form onSubmit={handleSubmit}>
        {creationError && <Alert>{creationError}</Alert>}

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
          disabled={showDate}
          onChange={scheduleField.handleChange}
        />

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
