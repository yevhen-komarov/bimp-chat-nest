import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { MessageFile } from './message-file.entity';
import { MessageText } from './message-text.entity';
import { User } from './user.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToOne(() => MessageFile, 'message', { cascade: true })
  messageFile: MessageFile;

  @OneToOne(() => MessageText, 'message', { cascade: true })
  messageText: MessageText;
}
