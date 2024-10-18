import { ServiceError } from '../errors/apiErrors';
import Appointment from '../models/Appointment';
import Schedule from '../models/Schedule';
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

    // create schedule
    const schedule = await Schedule.create({
      date,
      doctorId: doctor,
    });

    await schedule.save();


    console.log('schedule', schedule);

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
