import { ServiceError } from '../errors/apiErrors';
import DoctorSchedule from '../models/DoctorSchedule';

interface Request {
    doctorId: number;
    weekday: string;
    startTime: string;
    endTime: string;
}

class EditDoctorScheduleService {

  private doctorId: number;

  constructor(doctorId: number) {
    this.doctorId = doctorId;
  }

  public async execute({ doctorId, ...rest }: Request): Promise<DoctorSchedule> {
    const doctor = await DoctorSchedule.findOne(doctorId);
    if (!doctor) {
      throw new ServiceError(
        `Médico de id=${doctorId} não encontrado.`,
      );
    }

    // const doctorSchedule = await DoctorSchedule.findOne(doctorId);
    // find where doctorId = doctorId and weekday = weekday
    const doctorSchedule = await DoctorSchedule.findOne({ where: { doctorId: doctorId, weekday: rest.weekday } });

    doctorSchedule.startTime = rest.startTime;
    doctorSchedule.endTime = rest.endTime;

    await doctorSchedule.save();

    return doctorSchedule;
  }
}

export default EditDoctorScheduleService;
