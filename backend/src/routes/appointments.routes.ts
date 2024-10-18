import { classToPlain } from 'class-transformer';
import { Router } from 'express';
import CreateAppointmentDto from '../dtos/CreateAppointmentDto';
import { NotFound } from '../errors/apiErrors';
import Appointment from '../models/Appointment';
import CancelAppointmentService from '../services/CancelAppointmentService';
import CreateAppointmentService from '../services/CreateAppointmentService';
import { transformAndValidate } from '../utils';

const appointmentsRouter = Router();

appointmentsRouter.get('/', async (request, response) => {
  console.log('request.user.id', request.user.id);
  const userId = request.user.id;
  const appointments = await Appointment.findAvailablesByUser(userId, request.query);

  return response.json(classToPlain(appointments));
});

appointmentsRouter.post('/', async (request, response) => {
  const userId = request.user.id;
  const { date, time, doctor } = await transformAndValidate(
    CreateAppointmentDto,
    request.body,
  );

  const appointmentService = new CreateAppointmentService();
  const appointment = await appointmentService.execute({
    userId,
    date,
    time,
    doctor,
  });

  return response.status(201).json(classToPlain(appointment));
});

appointmentsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  const userId = request.user.id;

  const appointment = await Appointment.findOneAvailableByUserAndId(userId, id);

  if (!appointment) {
    throw new NotFound();
  }

  const appointmentService = new CancelAppointmentService();
  await appointmentService.execute({ appointment });

  return response.status(204).send();
});

appointmentsRouter.post('/obs/:id', async (request, response) => {
  const id = request.params.id
  const userId = request.user.id;

  const appointment = await Appointment.findOneAvailableByUserAndId(userId, id);

  if (!appointment) {
    throw new NotFound();
  }

  appointment.observation = request.body.content;
  await appointment.save();

  return response.json(classToPlain(appointment));
});

export default appointmentsRouter;
