import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Cards {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'img_url',
    type: 'text',
    unique: true,
  })
  imageUrl: string;

  @Column('text')
  title: string;

  @Column({
    name: 'content_type,',
    type: 'text',
  })
  contentType: string;
}
