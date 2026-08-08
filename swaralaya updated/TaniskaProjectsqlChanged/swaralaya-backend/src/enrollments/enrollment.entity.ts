import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('enrollments')
export class Enrollment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  course: string;

  @Column({ nullable: true })
  experience: string;

  @Column({ nullable: true, type: 'text' })
  message: string;

  @Column({ nullable: true })
  age: string;

  @Column({ default: 'pending' })
  status: string;

  @Column({ nullable: true, type: 'text' })
  adminNote: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
