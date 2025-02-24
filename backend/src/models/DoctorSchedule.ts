import { Exclude, Expose } from 'class-transformer';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('doctor_schedules')
class DoctorSchedule extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Exclude()
  @Column({ name: 'doctor_id' })
  doctorId: number;

  @Column()
  weekday: string;

  @Column()
  startTime: string;

  @Column()
  endTime: string;
  
  @Expose({ name: 'dateJoined' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

}

export default DoctorSchedule;
