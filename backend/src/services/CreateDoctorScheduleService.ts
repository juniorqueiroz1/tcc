import { ServiceError } from '../errors/apiErrors';
import Doctor from '../models/Doctor';
import DoctorSchedule from '../models/DoctorSchedule';

interface Request {
  doctorId: number;
  weekday: string;
  startTime: string;
  endTime: string;
}

class CreateDoctorScheduleService {
  public async execute({ doctorId, ...rest }: Request): Promise<DoctorSchedule> {
    const doctor = await Doctor.findOne(doctorId);
    if (!doctor) {
      throw new ServiceError(
        `Médico de id=${doctorId} não encontrado.`,
      );
    }

    const doctorSchedule = DoctorSchedule.create({ ...rest, doctorId });
    await doctorSchedule.save();

    return doctorSchedule;
  }
}

export default CreateDoctorScheduleService;
