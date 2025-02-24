
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import Appointment from "./Appointment";

@Entity("anamnesis")
class Anamnesis extends BaseEntity  {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  description: string;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @ManyToOne(() => Appointment, (appointment) => appointment.anamneses, {
    onDelete: "CASCADE",
  })
  appointment: Appointment;
}


export default Anamnesis;