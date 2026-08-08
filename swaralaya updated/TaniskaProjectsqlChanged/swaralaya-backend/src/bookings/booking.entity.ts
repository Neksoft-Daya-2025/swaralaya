import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Event } from '../events/event.entity';
import { BookingItem } from './booking-item.entity';

export enum BookingStatus {
  Pending = 'pending',
  Paid = 'paid',
  Confirmed = 'confirmed',
  Cancelled = 'cancelled',
}

@Entity('event_bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column()
  bookingReference: string;

  @Index()
  @Column()
  eventId: string;

  @ManyToOne(() => Event, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'eventId' })
  event?: Event | null;

  @Column()
  customerName: string;

  @Column()
  customerEmail: string;

  @Column({ type: 'varchar', nullable: true })
  customerPhone: string | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ type: 'json', nullable: true })
  attendees: Array<{ name: string; email: string }> | null;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalAmount: number;

  @Column({ type: 'varchar', default: BookingStatus.Pending })
  status: BookingStatus;

  @Index()
  @Column({ type: 'varchar', nullable: true })
  molliePaymentId: string | null;

  @Column({ type: 'varchar', length: 32, nullable: true })
  paymentMethod: string | null;

  /** Mollie / local payment state: pending | paid | free | cancelled | failed | expired */
  @Column({ type: 'varchar', length: 32, default: 'pending' })
  paymentStatus: string;

  @Column({ type: 'boolean', default: false })
  confirmationEmailSent: boolean;

  @OneToMany(() => BookingItem, (item) => item.booking)
  items?: BookingItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
