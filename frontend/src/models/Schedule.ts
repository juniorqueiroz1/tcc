import Doctor from './Doctor';

export default interface Schedule {
  id: number;
  date: string;
  doctor: Doctor;
  times: string[];
}
