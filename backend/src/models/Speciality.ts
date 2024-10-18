import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Doctor from './Doctor';

@Entity('speciality')
class Speciality extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(() => Doctor, doctor => doctor.speciality)
  doctors: Doctor[];

  static findByName(name?: string): Promise<Speciality[]> {
    var query = this.createQueryBuilder('speciality').orderBy({
      'speciality.name': 'ASC',
    });

    if (name) {
      query = query.where('speciality.name ILIKE :name', { name: `%${name}%` });
    }

    return query.getMany();
  }
}

export default Speciality;
