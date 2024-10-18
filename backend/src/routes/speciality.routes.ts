import { Router } from 'express';
import CreateSpecialityDto from '../dtos/CreateSpecialityDto';
import { NotFound } from '../errors/apiErrors';
import Speciality from '../models/Speciality';
import { transformAndValidate } from '../utils';

const specialitiesRouter = Router();

specialitiesRouter.get('/', async (request, response) => {
  const { search = '' } = request.query;
  const results = await Speciality.findByName(search.toString());

  return response.json(results);
});

specialitiesRouter.post('/', async (request, response) => {
  let body = request.body;
   if(!body.id){
    body.id = 0;
  }

  console.log(request.body);
  const dto = await transformAndValidate(CreateSpecialityDto, request.body);

  if(body.id == 0){
    
    const speciality = Speciality.create(dto);
    await speciality.save();

    return response.status(201).json(speciality);
  }
  else{
    const speciality = await Speciality.findOne(body.id);
    if (!speciality) {
      throw new NotFound();
    }
    const specialityEdited = Object.assign(speciality, dto);
    await specialityEdited.save();
  }

  
});

specialitiesRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const speciality = await Speciality.findOne(id);

  if (!speciality) {
    throw new NotFound();
  }

  await speciality.remove();

  return response.status(204).send();
});

specialitiesRouter.get('/:id', async (request, response) => {
  const { id } = request.params;

  const speciality = await Speciality.findOne(id);

  if (!speciality) {
    throw new NotFound();
  }

  return response.json(speciality);
});

export default specialitiesRouter;
