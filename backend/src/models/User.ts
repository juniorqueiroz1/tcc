import { hash } from 'bcryptjs';
import { Exclude, Expose } from 'class-transformer';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import authConfig from '../config/auth';

@Entity('account_user')
class User extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ name: 'is_admin', default: false })
  isAdmin: boolean;

  @Column({ name: 'last_login', nullable: true })
  lastLogin?: Date;

  @Expose({ name: 'dateJoined' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  public async setPassword(password: string): Promise<void> {
    this.password = await hash(password, authConfig.salt);
  }

  public async updateLastLogin(): Promise<void> {
    this.lastLogin = new Date();
    await this.save();
  }
}

export default User;
