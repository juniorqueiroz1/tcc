import Doctor from './Doctor';

export default interface Appointment {
  id: number;
  date: string;
  time: string;
  doctor: Doctor;
}
