import { classToPlain } from 'class-transformer';
import { Router } from 'express';
import DoctorSchedule from '../models/DoctorSchedule';
import CreateDoctorScheduleService from '../services/CreateDoctorScheduleService';
import DeleteDoctorScheduleService from '../services/DeleteDoctorScheduleService';

const doctorScheduleRouter = Router();

doctorScheduleRouter.post('/', async (request, response) => {
  const { doctorId, weekday, startTime, endTime } = request.body;

  if (!doctorId || !weekday || !startTime || !endTime) {
    return response
      .status(400)
      .json({ error: 'doctorId, weekday, startTime e endTime são obrigatórios' });
  }

  // --- Validação opcional: Verificar sobreposição de intervalos ---
  // Busca todos os intervalos do médico para o mesmo dia (weekday)
  const schedules = await DoctorSchedule.find({ where: { doctorId, weekday } });

  // Função para converter horário (string "HH:mm") em minutos
  const convertTimeToMinutes = (time: string): number => {
    const [hour, minute] = time.split(':').map(Number);
    return hour * 60 + minute;
  };

  const newStart = convertTimeToMinutes(startTime);
  const newEnd = convertTimeToMinutes(endTime);

  // Verifica se o novo intervalo se sobrepõe a algum existente
  const overlap = schedules.some(schedule => {
    const scheduleStart = convertTimeToMinutes(schedule.startTime);
    const scheduleEnd = convertTimeToMinutes(schedule.endTime);
    // A condição abaixo verifica se há interseção entre os intervalos
    return newStart < scheduleEnd && newEnd > scheduleStart;
  });

  if (overlap) {
    return response
      .status(400)
      .json({ error: 'Horário se sobrepõe a um intervalo existente.' });
  }
  // --- Fim da validação opcional ---

  // Cria um novo intervalo (agora sem editar intervalos existentes)
  const service = new CreateDoctorScheduleService();
  const schedule = await service.execute({ doctorId, weekday, startTime, endTime });

  return response.status(201).json(classToPlain(schedule));
});

doctorScheduleRouter.get('/:id', async (request, response) => {
  const { id } = request.params;
  const doctorSchedules = await DoctorSchedule.find({
    where: { doctorId: id },
  });

  return response.json(classToPlain(doctorSchedules));
});

doctorScheduleRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  try {
    const service = new DeleteDoctorScheduleService();
    await service.execute({ scheduleId: Number(id) });
    // Retorna status 204 (No Content) pois a exclusão foi realizada com sucesso
    return response.status(204).send();
  } catch (error) {
    return response.status(404).json({ error: error.message });
  }
});

export default doctorScheduleRouter;
