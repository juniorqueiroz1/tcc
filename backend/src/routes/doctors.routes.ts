import { classToPlain } from 'class-transformer';
import { Router } from 'express';
import CreateDoctorDto from '../dtos/CreateDoctorDto';
import FilterDoctorDto from '../dtos/FilterDoctorDto';
import { NotFound } from '../errors/apiErrors';
import Doctor from '../models/Doctor';
import CreateDoctorService from '../services/CreateDoctorService';
import EditDoctorService from '../services/EditDoctorService';
import { transformAndValidate } from '../utils';

const doctorsRouter = Router();

doctorsRouter.get('/', async (request, response) => {
  const { search, speciality } = await transformAndValidate(
    FilterDoctorDto,
    request.query,
  );

  const doctors = await Doctor.findBySearchAndSpeciality({
    search,
    speciality,
  });

  return response.json(classToPlain(doctors));
});

doctorsRouter.post('/', async (request, response) => {
  let body = request.body;

  // parse int crm and specialityId
  body.crm = parseInt(body.crm);
  body.doctorId = parseInt(body.doctorId);
  body.specialityId = parseInt(body.specialityId);
  if(!body.doctorId){
    body.doctorId = 0;
  }
  const dto = await transformAndValidate(CreateDoctorDto, request.body);

  
  if(body.doctorId == 0){
    
    const doctorService = new CreateDoctorService();
    const doctor = await doctorService.execute(dto);

    return response.status(201).json(classToPlain(doctor));
  }
  else{
    const doctor = await Doctor.findOne(body.doctorId);
    if (!doctor) {
      throw new NotFound();
    }
    const doctorService = new EditDoctorService(body.doctorId);
    const doctorEdited = await doctorService.execute(dto);
    return response.status(201).json(classToPlain(doctorEdited));
  }
});

doctorsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const doctor = await Doctor.findOne(id);

  if (!doctor) {
    throw new NotFound();
  }

  await doctor.remove();

  return response.status(204).send();
});

doctorsRouter.get('/:id', async (request, response) => {
  const { id } = request.params;

  const doctor = await Doctor.findOne(id);


  if (!doctor) {
    throw new NotFound();
  }

  return response.json(classToPlain(doctor));
});

export default doctorsRouter;
