import Doctor from './Doctor';
import User from './User';

export default interface Appointment {
  id: number;
  date: string;
  time: string;
  doctor: Doctor;
  user: User;
}
