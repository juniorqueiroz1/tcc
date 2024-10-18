import Appointment from '../models/Appointment';
import ScheduleTime from '../models/ScheduleTime';

interface Request {
  appointment: Appointment;
}

class CancelAppointmentService {
  public async execute({ appointment }: Request): Promise<void> {
    const { time, scheduleId } = appointment;
    const scheduleTime = await ScheduleTime.findOne({
      where: { time, scheduleId },
    });

    if (scheduleTime) {
      await scheduleTime.enable();
    }

    await appointment.softRemove();
  }
}

export default CancelAppointmentService;
