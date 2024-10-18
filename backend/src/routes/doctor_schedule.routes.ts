import { classToPlain } from 'class-transformer';
import { Router } from 'express';
import CreateDoctorScheduleDto from '../dtos/CreateDoctorSchedule';
import DoctorSchedule from '../models/DoctorSchedule';
import CreateDoctorScheduleService from '../services/CreateDoctorScheduleService';
import EditDoctorScheduleService from '../services/EditDoctorScheduleService';
import { transformAndValidate } from '../utils';

const doctorScheduleRouter = Router();

doctorScheduleRouter.post('/', async (request, response) => {
  const dto = await transformAndValidate(
    CreateDoctorScheduleDto,
    request.body,
  );

  const doctorSchedules = await DoctorSchedule.find({
    where: { doctorId: dto.doctorId },
  });

  // check if doctor already has a schedule and weekday is the same
  if (doctorSchedules.length > 0 && doctorSchedules.some((doctorSchedule) => doctorSchedule.weekday === dto.weekday)) {
    const doctorService = new EditDoctorScheduleService(dto.doctorId);
    const doctorEdited = await doctorService.execute(dto);
    return response.status(201).json(classToPlain(doctorEdited));
  }

  const service = new CreateDoctorScheduleService();
  const data = await service.execute(dto);

  return response.status(201).json(classToPlain(data));
});

doctorScheduleRouter.get('/:id', async (request, response) => {
  const { id } = request.params;
  const doctorSchedules = await DoctorSchedule.find({
    where: { doctorId: id },
  });

  return response.json(classToPlain(doctorSchedules));
});

export default doctorScheduleRouter;
