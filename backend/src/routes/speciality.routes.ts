import { Router } from 'express';
import Speciality from '../models/Speciality';

const specialitiesRouter = Router();

specialitiesRouter.get('/', async (request, response) => {
  const { search = '' } = request.query;
  const results = await Speciality.findByName(search.toString());

  return response.json(results);
});

specialitiesRouter.post('/', async (request, response) => {
  let { id = 0, name, description } = request.body;

  if (!name || !description) {
    return response.status(400).json({ error: 'Nome e descrição são obrigatórios' });
  }

  if (id == 0) {
    // Criar uma nova especialidade
    const speciality = Speciality.create({ name, description });
    await speciality.save();

    return response.status(201).json(speciality);
  } else {
    // Editar uma especialidade existente
    const speciality = await Speciality.findOne(id);
    if (!speciality) {
      return response.status(404).json({ message: 'Speciality not found' });
    }

    speciality.name = name;
    speciality.description = description;
    await speciality.save();

    return response.status(200).json(speciality);
  }
});

specialitiesRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const speciality = await Speciality.findOne(id);

  if (!speciality) {
    return response.status(404).json({ message: 'Speciality not found' });
  }

  await speciality.remove();

  return response.status(204).send();
});

specialitiesRouter.get('/:id', async (request, response) => {
  const { id } = request.params;

  const speciality = await Speciality.findOne(id);

  if (!speciality) {
    return response.status(404).json({ message: 'Speciality not found' });
  }

  return response.json(speciality);
});

export default specialitiesRouter;
