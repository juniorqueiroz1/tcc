import { classToPlain } from 'class-transformer';
import { Router } from 'express';
import Schedule from '../models/Schedule';
import CreateScheduleService from '../services/CreateScheduleService';

const schedulesRouter = Router();

schedulesRouter.get('/', async (request, response) => {
  const { doctor, speciality, dateAfter, dateBefore } = request.query;

  // Validação manual dos filtros
  if (!doctor && !speciality && !dateAfter && !dateBefore) {
    return response.status(400).json({ error: 'Pelo menos um filtro deve ser fornecido.' });
  }

  const schedules = await Schedule.findAvailables({ doctor, speciality, dateAfter, dateBefore });

  return response.json(classToPlain(schedules));
});

schedulesRouter.post('/', async (request, response) => {
  const { doctorId, date, times } = request.body;

  // Validação manual dos campos obrigatórios
  if (!doctorId || !date || !times || times.length === 0) {
    return response.status(400).json({ error: 'doctorId, date e times são obrigatórios e times não pode estar vazio.' });
  }

  const scheduleService = new CreateScheduleService();
  const schedule = await scheduleService.execute({ doctorId, date, times });

  return response.status(201).json(classToPlain(schedule));
});

export default schedulesRouter;
