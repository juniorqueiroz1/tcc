import { ServiceError } from '../errors/apiErrors';
import Anamnesis from '../models/Anamnesis';
import Appointment from '../models/Appointment';

interface CreateRequest {
  description: string;
  appointmentId: number;
}

interface UpdateRequest {
  description?: string;
}

class CreateAnamnesisService {
  public static async execute({ description, appointmentId }: CreateRequest): Promise<Anamnesis> {
    const appointment = await Appointment.findOne({ where: { id: appointmentId } });
    
    if (!appointment) {
      throw new ServiceError('Consulta não encontrada.');
    }
    
    const anamnesis = Anamnesis.create({ description, appointment  });
    await anamnesis.save();
    
    const fullAnamnesis = await Anamnesis.findOne({
      where: { id: anamnesis.id },
      relations: ['appointment'], // Certifique-se de carregar a relação
    });

    return fullAnamnesis!;
  }
}

class UpdateAnamnesisService {
  public static async execute(id: number, { description }: UpdateRequest): Promise<Anamnesis> {
    const anamnesis = await Anamnesis.findOne({ where: { id } });
    
    if (!anamnesis) {
      throw new ServiceError('Anamnese não encontrada.');
    }
    
    anamnesis.description = description;
    await anamnesis.save();
    return anamnesis;
  }
}

export { CreateAnamnesisService, UpdateAnamnesisService };

