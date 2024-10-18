import { Exclude, Expose, Transform } from 'class-transformer';
import { format, isEqual, parse, startOfSecond } from 'date-fns';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  SelectQueryBuilder,
} from 'typeorm';
import Doctor from './Doctor';
import ScheduleTime from './ScheduleTime';

interface FilterScheduleOptions {
  doctor?: string[];
  speciality?: string[];
  dateAfter?: string;
  dateBefore?: string;
}

@Entity('schedule')
class Schedule extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  date: Date;

  @Exclude()
  @Column({ name: 'doctor_id' })
  doctorId: number;

  @ManyToOne(() => Doctor, doctor => doctor.schedules)
  @JoinColumn({ name: 'doctor_id' })
  doctor: Doctor;

  @Expose({ toPlainOnly: true })
  @Transform((value: ScheduleTime[]) =>
    value.map(time => time.time.substring(0, 5)),
  )
  @OneToMany(() => ScheduleTime, scheduleTime => scheduleTime.schedule)
  times: ScheduleTime[];

  public getScheduleTime(time: string): ScheduleTime | undefined {
    return this.times.find(scheduleTime => {
      const parsedTime = parse(time, 'HH:mm', this.date);
      const parsedScheduleTime = parse(
        scheduleTime.time,
        'HH:mm:ss',
        this.date,
      );

      return isEqual(parsedTime, parsedScheduleTime);
    });
  }

  static findAvailables({
    doctor,
    speciality,
    dateAfter,
    dateBefore,
  }: FilterScheduleOptions) {
    const query = this.getAvailblesQuery();

    // Filtering
    if (doctor?.length) {
      query.andWhere('doctor.id IN (:...doctor)', { doctor });
    }

    if (speciality?.length) {
      query.andWhere('speciality.id IN (:...speciality)', { speciality });
    }

    if (dateAfter) {
      query.andWhere('schedule.date >= :dateAfter', { dateAfter });
    }

    if (dateBefore) {
      query.andWhere('schedule.date <= :dateBefore', { dateBefore });
    }

    return query.getMany();
  }

  static findOneAvailableById(id: number): Promise<Schedule | undefined> {
    return this.getAvailblesQuery()
      .andWhere('schedule.id = :id', { id })
      .getOne();
  }

  static getAvailblesQuery(): SelectQueryBuilder<Schedule> {
    const today = new Date();

    const dateFormat = 'yyyy-MM-dd HH:mm:ss';
    const minDateTime = format(startOfSecond(today), dateFormat);

    return this.createQueryBuilder('schedule')
      .innerJoinAndSelect('schedule.doctor', 'doctor')
      .innerJoinAndSelect('doctor.speciality', 'speciality')
      .innerJoinAndSelect(
        'schedule.times',
        'time',
        'time.is_available = :isAvailable AND (schedule.date + time.time) >= :minDateTime',
        {
          isAvailable: true,
          minDateTime,
        },
      )
      .orderBy({
        'schedule.date': 'ASC',
        'time.time': 'ASC',
      });
  }
}

export default Schedule;
