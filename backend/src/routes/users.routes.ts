import { classToPlain } from 'class-transformer';
import { Router } from 'express';
import CreateUserDto from '../dtos/CreateUserDto';
import User from '../models/User';
import CreateUserService from '../services/CreateUserService';
import { transformAndValidate } from '../utils';

const usersRouter = Router();

usersRouter.post('/', async (request, response) => {
  const { name, email, password } = await transformAndValidate(
    CreateUserDto,
    request.body,
  );

  const userService = new CreateUserService();
  const user = await userService.execute({ name, email, password });

  return response.status(201).json(classToPlain(user));
});

usersRouter.get('/', async (request, response) => {

  const patients = await User.find();

  return response.json(classToPlain(patients));
});

export default usersRouter;
