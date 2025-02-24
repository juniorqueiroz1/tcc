import { ServiceError } from '../errors/apiErrors';
import Appointment from '../models/Appointment';
import Schedule from '../models/Schedule';
import ScheduleTime from '../models/ScheduleTime';
interface Request {
  userId: number;
  time: string;
  doctor: number;
  date: string;
}

class CreateAppointmentService {
  public async execute({
    userId,
    date,
    time,
    doctor,
  }: Request): Promise<Appointment> {
    // const schedule = await Schedule.findOneAvailableById(scheduleId);
    // if (!schedule) {
    //   throw new ServiceError('Agenda não encontrada.');
    // }

    const [year, month, day] = date.split('-').map(Number);
    const localDate = new Date(Date.UTC(year, month - 1, day)); // Usa UTC direto

    // create schedule
    const schedule = await Schedule.create({
      date: localDate,  
      doctorId: doctor,
    });

    await schedule.save();

    const scheduleTime = await ScheduleTime.create({
      time,
      isAvailable: false,
      scheduleId: schedule.id,
    });

    await scheduleTime.save();


    const appointmentOnSameDate = await Appointment.findOneByUserAndDate(
      userId,
      schedule.date,
      time,
    );

    if (appointmentOnSameDate) {
      throw new ServiceError(
        'Você já tem uma consulta marcada para esta mesma data e horário.',
      );
    }

    const appointment = Appointment.create({
      userId,
      schedule,
      time: time,
    });

    await appointment.save();

    return appointment;
  }
}

export default CreateAppointmentService;
