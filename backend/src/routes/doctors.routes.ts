import { classToPlain } from 'class-transformer';
import { Router } from 'express';
import CreateDoctorDto from '../dtos/CreateDoctorDto';
import FilterDoctorDto from '../dtos/FilterDoctorDto';
import { NotFound } from '../errors/apiErrors';
import Appointment from '../models/Appointment';
import Doctor from '../models/Doctor';
import DoctorSchedule from '../models/DoctorSchedule';
import Schedule from '../models/Schedule';
import CreateDoctorService from '../services/CreateDoctorService';
import EditDoctorService from '../services/EditDoctorService';
import { transformAndValidate } from '../utils';

const doctorsRouter = Router();

doctorsRouter.get('/', async (request, response) => {
  const { search, speciality } = await transformAndValidate(
    FilterDoctorDto,
    request.query,
  );

  const doctors = await Doctor.findBySearchAndSpeciality({
    search,
    speciality,
  });

  return response.json(classToPlain(doctors));
});

doctorsRouter.post('/', async (request, response) => {
  let body = request.body;

  // parse int crm and specialityId
  body.crm = parseInt(body.crm);
  body.doctorId = parseInt(body.doctorId);
  body.specialityId = parseInt(body.specialityId);
  if(!body.doctorId){
    body.doctorId = 0;
  }
  const dto = await transformAndValidate(CreateDoctorDto, request.body);

  
  if(body.doctorId == 0){
    
    const doctorService = new CreateDoctorService();
    const doctor = await doctorService.execute(dto);

    return response.status(201).json(classToPlain(doctor));
  }
  else{
    const doctor = await Doctor.findOne(body.doctorId);
    if (!doctor) {
      throw new NotFound();
    }
    const doctorService = new EditDoctorService(body.doctorId);
    const doctorEdited = await doctorService.execute(dto);
    return response.status(201).json(classToPlain(doctorEdited));
  }
});

doctorsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const doctor = await Doctor.findOne(id);

  if (!doctor) {
    throw new NotFound();
  }

  await doctor.remove();

  return response.status(204).send();
});

doctorsRouter.get('/:id', async (request, response) => {
  const { id } = request.params;

  const doctor = await Doctor.findOne(id);


  if (!doctor) {
    throw new NotFound();
  }

  return response.json(classToPlain(doctor));
});

doctorsRouter.get('/:id/available-times', async (request, response) => {
  const { id } = request.params;
  const { date } = request.query;

  if (!date || typeof date !== 'string') {
    return response.status(400).json({
      error: 'O parâmetro "date" é obrigatório e deve estar no formato YYYY-MM-DD.'
    });
  }

  const doctorId = parseInt(id, 10);
  const doctor = await Doctor.findOne(doctorId);
  if (!doctor) {
    return response.status(404).json({ error: 'Médico não encontrado.' });
  }

  let availableTimes: string[] = [];
  let bookedTimes: string[] = [];
  let appointments: Appointment[] = [];

  const schedules = await Schedule.find({
    where: { doctorId, date },
    relations: ['times']
  });

  // Função auxiliar revisada para considerar múltiplos horários
  const gerarHorariosPadrao = async (): Promise<string[]> => {
    const selectedDate = new Date(date);
    const weekDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const weekday = weekDays[selectedDate.getUTCDay()];
    
    // Busca TODOS os horários do médico para esse dia da semana
    const doctorSchedules = await DoctorSchedule.find({
      where: { doctorId, weekday }
    });

    if (doctorSchedules.length === 0) return [];

    const times: string[] = [];
    
    // Gera horários para cada período cadastrado
    for (const schedule of doctorSchedules) {
      const startHour = parseInt(schedule.startTime.split(':')[0], 10);
      const endHour = parseInt(schedule.endTime.split(':')[0], 10);
      
      for (let hour = startHour; hour < endHour; hour++) {
        times.push(`${hour.toString().padStart(2, '0')}:00`);
      }
    }

    return times;
  };

  if (schedules) {
    const horariosGerados = await gerarHorariosPadrao();
    availableTimes = horariosGerados;
    for (const schedule of schedules) {
      appointments = await Appointment.find({
        where: { scheduleId: schedule.id }
      });
      bookedTimes = appointments.map(app => app.time.substring(0, 5));
      
      // Remove horários em uso dos horários disponíveis
      availableTimes = availableTimes.filter(time => !bookedTimes.includes(time));
    }
  } else {
    const horariosGerados = await gerarHorariosPadrao();
    
    appointments = await Appointment.createQueryBuilder('appointment')
      .innerJoin(Schedule, 'schedule', 'appointment.schedule_id = schedule.id')
      .where('schedule.doctor_id = :doctorId', { doctorId })
      .andWhere('schedule.date = :date', { date })
      .getMany();
      
    bookedTimes = appointments.map(app => app.time.substring(0, 5));
    availableTimes = horariosGerados.filter(time => !bookedTimes.includes(time));
  }

  return response.json(availableTimes);
});


export default doctorsRouter;