import { classToPlain } from 'class-transformer';
import { Router } from 'express';
import { NotFound } from '../errors/apiErrors';
import Appointment from '../models/Appointment';
import CancelAppointmentService from '../services/CancelAppointmentService';
import CreateAppointmentService from '../services/CreateAppointmentService';

const appointmentsRouter = Router();

appointmentsRouter.get('/', async (request, response) => {
  const userId = request.user.id;
  const isDoctor = Boolean(request.user.crm);
  const appointments = await Appointment.findAvailablesByUser(userId, request.query, isDoctor);
  
  return response.json(classToPlain(appointments));
});

appointmentsRouter.post('/', async (request, response) => {
  let userId, doctor;

  if (request.user.crm) {
    doctor = request.user.id;
    userId = request.body.patient;
  } else {
    userId = request.user.id;
    doctor = request.body.doctor;
  }

  if (!request.body.date || !request.body.time) {
    return response.status(400).json({ error: "Date and time are required." });
  }

  const { date, time } = request.body;
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
  const { id } = request.params;
  const userId = request.user.id;

  const appointment = await Appointment.findOneAvailableByUserAndId(userId, id);

  if (!appointment) {
    throw new NotFound();
  }

  if (!request.body.content) {
    return response.status(400).json({ error: "Observation content is required." });
  }

  appointment.observation = request.body.content;
  await appointment.save();

  return response.json(classToPlain(appointment));
});

export default appointmentsRouter;
