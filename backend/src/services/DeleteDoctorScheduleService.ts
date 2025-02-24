import { ServiceError } from '../errors/apiErrors';
import DoctorSchedule from '../models/DoctorSchedule';

interface Request {
  scheduleId: number;
}

class DeleteDoctorScheduleService {
  public async execute({ scheduleId }: Request): Promise<void> {
    // Busca o schedule pelo id informado
    const schedule = await DoctorSchedule.findOne(scheduleId);

    if (!schedule) {
      throw new ServiceError(`Agendamento com id ${scheduleId} não encontrado.`);
    }

    // Remove o registro do banco de dados
    await schedule.remove();
  }
}

export default DeleteDoctorScheduleService;
