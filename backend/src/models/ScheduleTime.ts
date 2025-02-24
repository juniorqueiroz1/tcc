import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Schedule from './Schedule';

@Entity('schedule_time')
class ScheduleTime extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('time')
  time: string;

  @Column({ name: 'is_available' })
  isAvailable: boolean;

  @Column({ name: 'schedule_id' })
  scheduleId: number;

  @ManyToOne(() => Schedule, schedule => schedule.times)
  @JoinColumn({ name: 'schedule_id' })
  schedule: Schedule;

  public async disable() {
    this.isAvailable = false;
    await this.save();
  }

  public async enable() {
    this.isAvailable = true;
    await this.save();
  }
}

export default ScheduleTime;
