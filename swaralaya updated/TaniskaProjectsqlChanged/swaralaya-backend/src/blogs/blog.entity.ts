import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('blogs')
export class Blog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ nullable: true })
  excerpt: string;

  @Column({ nullable: true })
  coverImage: string;

  @Column({ default: 'General' })
  category: string;

  @Column({ default: 'Swaralaya School of Music' })
  author: string;

  @Column({ default: true })
  published: boolean;

  @Column({ default: 'checkmark' })
  bulletStyle: string;

  @Column({ unique: true })
  slug: string;

  @Column('json', { nullable: true })
  sections: Array<{
    title?: string;
    subheading?: string;
    content?: string;
    image?: string;
    imagePosition?: 'left' | 'right';
    imageHeight?: number;
    imageWidth?: number;
    galleryImages?: string[];
    hideBullets?: boolean;
  }>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
