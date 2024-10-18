import Speciality from './Speciality';

export default interface Doctor {
  id: number;
  name: string;
  crm: number;
  email: string;
  phone: string;
  speciality: Speciality;
}
