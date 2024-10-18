import { hash } from 'bcryptjs';
import {
  BaseEntity,
  Brackets,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import authConfig from '../config/auth';
import Schedule from './Schedule';
import Speciality from './Speciality';

interface FilterDoctorOptions {
  search?: string;
  speciality?: string[];
}

@Entity()
class Doctor extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  crm: number;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  password: string;

  @Column({ name: 'speciality_id' })
  specialityId: number;

  @ManyToOne(() => Speciality, speciality => speciality.doctors)
  @JoinColumn({ name: 'speciality_id' })
  speciality: Speciality;

  @OneToMany(() => Schedule, schedule => schedule.doctor)
  schedules: Schedule[];

  static findBySearchAndSpeciality({
    search,
    speciality,
  }: FilterDoctorOptions): Promise<Doctor[]> {
    const query = this.createQueryBuilder('doctor').leftJoinAndSelect(
      'doctor.speciality',
      'speciality',
    );

    if (search) {
      query.andWhere(
        new Brackets(qb => {
          qb.where('doctor.name ILIKE :search', { search: `%${search}%` });
          qb.orWhere('doctor.email ILIKE :search', { search: `%${search}%` });

          if (Number.isInteger(Number(search))) {
            qb.orWhere('doctor.crm = :search', { search });
          }
        }),
      );
    }

    if (speciality?.length) {
      query.andWhere('speciality.id IN (:...speciality)', { speciality });
    }

    return query.getMany();
  }

  public async setPassword(password: string): Promise<void> {
    this.password = await hash(password, authConfig.salt);
  }
}

export default Doctor;
