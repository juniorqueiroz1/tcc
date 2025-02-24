import { classToPlain } from 'class-transformer';
import { Router } from 'express';
import Anamnesis from '../models/Anamnesis';
import { CreateAnamnesisService, UpdateAnamnesisService } from '../services/AnamneseService';

const anamneseRouter = Router();

// Listar anamneses de um appointment específico
anamneseRouter.get('/:appointment_id', async (request, response) => {
  const { appointment_id } = request.params;

  if (!appointment_id) {
    return response.status(400).json({ error: 'appointment_id é obrigatório' });
  }

  const anamneses = await Anamnesis.find({ where: { appointment: appointment_id } });

  return response.json(classToPlain(anamneses));
});

// Criar uma nova anamnese
anamneseRouter.post('/', async (request, response) => {
  const { appointmentId, description } = request.body;

  if (!appointmentId || !description) {
    return response.status(400).json({ error: 'appointment e description são obrigatórios' });
  }

  const anamnese = await CreateAnamnesisService.execute({ description, appointmentId });

  return response.status(201).json(classToPlain(anamnese));
});

// Atualizar uma anamnese existente
anamneseRouter.put('/:id', async (request, response) => {
  const { id } = request.params;
  const { description } = request.body;

  if (!description) {
    return response.status(400).json({ error: 'A descrição é obrigatória para atualização' });
  }

  const updatedAnamnese = await UpdateAnamnesisService.execute(Number(id), { description });

  return response.json(classToPlain(updatedAnamnese));
});

// Deletar uma anamnese existente
anamneseRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  const anamnese = await Anamnesis.findOne({ where: { id } });

  if (!anamnese) {
    return response.status(404).json({ error: 'Anamnese não encontrada' });
  }

  await anamnese.remove();

  return response.status(204).send();
});

export default anamneseRouter;
