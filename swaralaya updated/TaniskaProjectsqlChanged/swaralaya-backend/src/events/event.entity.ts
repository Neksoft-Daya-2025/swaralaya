import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  date: string;

  @Column({ nullable: true })
  time: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  registrationLink: string;

  @Column({ default: true })
  published: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  ticketPrice: number;

  @Column({ type: 'int', default: 0 })
  ticketCapacity: number;

  @Column({ type: 'int', default: 0 })
  ticketsSold: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}