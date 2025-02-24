import { Exclude, Expose, Transform } from 'class-transformer';
import { format, startOfSecond } from 'date-fns';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  SelectQueryBuilder,
  UpdateDateColumn,
} from 'typeorm';
import Anamnesis from './Anamnesis';
import Doctor from './Doctor';
import Schedule from './Schedule';
import User from './User';

@Entity()
class Appointment extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Exclude()
  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Exclude()
  @Column({ name: 'schedule_id' })
  scheduleId: number;

  @Column('observation')
  @Column({ name: 'observation', nullable: true })
  observation: string;


  @Exclude()
  @ManyToOne(() => Schedule)
  @JoinColumn({ name: 'schedule_id' })
  schedule: Schedule;

  @Column('time')
  @Transform((value: string) => value.substring(0, 5))
  time: string;

  @Exclude()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @OneToMany(() => Anamnesis, (anamnesis) => anamnesis.appointment, {
    cascade: true,
  })
  anamneses: Anamnesis[];

  @Expose()
  public get date(): Date | null {
    return this.schedule ? this.schedule.date : null;
  }

  @Expose()
  public get doctor(): Doctor | null {
    return this.schedule ? this.schedule.doctor : null;
  }

  static findOneByUserAndDate(
    userId: number,
    date: Date,
    time: string,
  ): Promise<Appointment | undefined> {
    return this.createQueryBuilder('appointment')
      .innerJoin('appointment.schedule', 'schedule')
      .where('appointment.user_id = :userId', { userId })
      .andWhere('schedule.date = :date', { date })
      .andWhere('appointment.time = :time', { time })
      .getOne();
  }

  static findAvailablesByUser(userId: number, filter: any, isDoctor: boolean): Promise<Appointment[]> {
      let query = this.getAvailablesQuery();
      console.log('filter', filter);
      if (isDoctor) {
          // Filtra apenas as consultas associadas ao médico logado
          query = query.andWhere('schedule.doctor_id = :doctorId', { doctorId: userId });
          console.log('filter', filter.patient);
          if(filter.patient && filter.patient !== '') {
            query = query.andWhere('appointment.user_id = :userId', { userId: filter.patient });
          }
      } else {
          // Filtra apenas as consultas associadas ao paciente logado
          query = query.andWhere('appointment.user_id = :userId', { userId });
      }

      // Filtro opcional por médico
      if (filter.doctor && filter.doctor !== '') {
          query = query.andWhere('schedule.doctor_id = :doctorId', { doctorId: filter.doctor });
      }

      // Filtro opcional por especialidade
      if (filter.specialityId && filter.specialityId !== '') {
          query = query.innerJoin('doctor.speciality', 'speciality')
                      .andWhere('speciality.id = :specialityId', { specialityId: filter.specialityId });
      }

      // Filtro por intervalo de datas
      if (filter.date_start && filter.date_start !== '' && filter.date_end && filter.date_end !== '') {
          query = query.andWhere('schedule.date BETWEEN :date_start AND :date_end', {
              date_start: filter.date_start,
              date_end: filter.date_end,
          });
      }

      return query.getMany();
  }

  static getAvailablesQuery(): SelectQueryBuilder<Appointment> {
    return this.createQueryBuilder('appointment')
        .innerJoinAndSelect('appointment.user', 'user')
        .innerJoinAndSelect('appointment.schedule', 'schedule')
        .innerJoinAndSelect('schedule.doctor', 'doctor')
        .leftJoinAndSelect('doctor.speciality', 'speciality') // Adicionado LEFT JOIN
        .where('appointment.deleted_at IS NULL') // Evita registros excluídos
        .orderBy({
            'schedule.date': 'ASC',
            'appointment.time': 'ASC',
            'appointment.createdAt': 'DESC',
        });
  }

  static findOneAvailableByUserAndId(
    userId: number,
    id: number | string,
  ): Promise<Appointment | undefined> {
    return this.getAvailblesQuery()
      .andWhere('appointment.user_id = :userId', { userId })
      .andWhere('appointment.id = :id', { id })
      .getOne();
  }

  static getAvailblesQuery(): SelectQueryBuilder<Appointment> {
    const today = new Date();
    const dateFormat = 'yyyy-MM-dd HH:mm:ss';
    const minDateTime = format(startOfSecond(today), dateFormat);

    return this.createQueryBuilder('appointment')
      .innerJoinAndSelect('appointment.schedule', 'schedule')
      .innerJoinAndSelect('schedule.doctor', 'doctor')
      .innerJoinAndSelect('doctor.speciality', 'specielity')
      .orderBy({
        'schedule.date': 'ASC',
        'appointment.time': 'ASC',
        'appointment.created_at': 'DESC',
      });
  }
}

export default Appointment;
