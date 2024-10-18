import { ServiceError } from '../errors/apiErrors';
import Doctor from '../models/Doctor';
import Speciality from '../models/Speciality';

interface Request {
  name: string;
  crm: number;
  email: string;
  phone: string;
  specialityId: number;
  doctorId: number;
  password: string;
}

class EditDoctorService {

  private doctorId: number;

  constructor(doctorId: number) {
    this.doctorId = doctorId;
  }

  public async execute({ doctorId, specialityId, password, ...rest }: Request): Promise<Doctor> {
    const speciality = await Speciality.findOne(specialityId);
    if (!speciality) {
      throw new ServiceError(
        `Especialidade de id=${specialityId} não encontrada.`,
      );
    }

    // const doctor = Doctor.Edit({ ...est, speciality });
    // edit doctor
    const doctor = await Doctor.findOne(doctorId);
    if (!doctor) {
      throw new ServiceError(
        `Médico de id=${doctorId} não encontrado.`,
      );
    }
    doctor.name = rest.name;
    doctor.crm = rest.crm;
    doctor.email = rest.email;
    doctor.phone = rest.phone;
    doctor.speciality = speciality;
    if(password !== '' && password !== undefined) {
      await doctor.setPassword(password);
    }
    
    await doctor.save();

    return doctor;
  }
}

export default EditDoctorService;
