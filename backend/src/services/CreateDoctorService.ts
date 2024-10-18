import { ServiceError } from '../errors/apiErrors';
import Doctor from '../models/Doctor';
import Speciality from '../models/Speciality';

interface Request {
  name: string;
  crm: number;
  email: string;
  phone: string;
  specialityId: number;
  password: string;
}

class CreateDoctorService {
  public async execute({ specialityId, password, ...rest }: Request): Promise<Doctor> {
    const speciality = await Speciality.findOne(specialityId);
    if (!speciality) {
      throw new ServiceError(
        `Especialidade de id=${specialityId} não encontrada.`,
      );
    }

    const doctor = Doctor.create({ ...rest, speciality });
    await doctor.setPassword(password);
    await doctor.save();

    return doctor;
  }
}

export default CreateDoctorService;
