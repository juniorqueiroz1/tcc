import { isBefore, parseISO, set, startOfDay, startOfSecond } from 'date-fns';
import { ServiceError } from '../errors/apiErrors';
import Doctor from '../models/Doctor';
import Schedule from '../models/Schedule';
import ScheduleTime from '../models/ScheduleTime';

interface Request {
  doctorId: number;
  date: string;
  times: string[];
}

class CreateScheduleService {
  public async execute({ doctorId, date, times }: Request): Promise<Schedule> {
    const doctor = await Doctor.findOne(doctorId, {
      relations: ['speciality'],
    });
    if (!doctor) {
      throw new ServiceError(`Médico de id=${doctorId} não encontrado.`);
    }

    const today = new Date();
    const parsedDate = startOfDay(parseISO(date));

    if (isBefore(parsedDate, startOfDay(today))) {
      throw new ServiceError(
        'Não é possível criar agendas para datas passadas.',
      );
    }

    const isDoctorAlreadyScheduled = await Schedule.findOne({
      doctorId,
      date: parsedDate,
    });

    if (isDoctorAlreadyScheduled) {
      throw new ServiceError(
        `O médico ${doctor.name} já está agendado para esta mesma data.`,
      );
    }

    const isSomeTimePast = times.some(time => {
      const [hours, minutes, seconds] = time
        .split(':')
        .map(part => Number(part));

      const scheduleTimeDate = set(parsedDate, { hours, minutes });

      return isBefore(scheduleTimeDate, startOfSecond(today));
    });

    if (isSomeTimePast) {
      throw new ServiceError(
        'Não é possível criar agendas para horários passados.',
      );
    }

    const schedule = Schedule.create({ doctor, date });
    await schedule.save();

    const timeInstances = times.map(time => {
      return ScheduleTime.create({
        time,
        isAvailable: true,
        scheduleId: schedule.id,
      });
    });

    schedule.times = await ScheduleTime.save(timeInstances);

    return schedule;
  }
}

export default CreateScheduleService;
