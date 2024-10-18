import { classToPlain } from 'class-transformer';
import { Router } from 'express';
import CreateScheduleDto from '../dtos/CreateScheduleDto';
import FilterScheduleDto from '../dtos/FilterScheduleDto';
import Schedule from '../models/Schedule';
import CreateScheduleService from '../services/CreateScheduleService';
import { transformAndValidate } from '../utils';

const schedulesRouter = Router();

schedulesRouter.get('/', async (request, response) => {
  const filter = await transformAndValidate(FilterScheduleDto, request.query);
  const schedules = await Schedule.findAvailables(filter);

  return response.json(classToPlain(schedules));
});

schedulesRouter.post('/', async (request, response) => {
  const dto = await transformAndValidate(CreateScheduleDto, request.body);
  const scheduleService = new CreateScheduleService();
  const schedule = await scheduleService.execute(dto);

  return response.status(201).json(classToPlain(schedule));
});

export default schedulesRouter;
