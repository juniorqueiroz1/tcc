import { Router } from 'express';
import isAuthenticated from '../middlewares/isAuthenticated';
import appointmentsRouter from './appointments.routes';
import doctorScheduleRouter from './doctor_schedule.routes';
import doctorsRouter from './doctors.routes';
import schedulesRouter from './schedules.routes';
import sessionsRouter from './sessions.routes';
import specialitiesRouter from './speciality.routes';
import usersRouter from './users.routes';

const routes = Router();

routes.use('/', sessionsRouter);
routes.use('/users', usersRouter);
routes.use(isAuthenticated);
routes.use('/specialities', specialitiesRouter);
routes.use('/doctors', doctorsRouter);
routes.use('/schedules', schedulesRouter);
routes.use('/appointments', appointmentsRouter);
routes.use('/doctor-schedules', doctorScheduleRouter);

export default routes;
