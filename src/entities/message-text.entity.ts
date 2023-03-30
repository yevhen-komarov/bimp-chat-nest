import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

import { Message } from './message.entity';

@Entity()
export class MessageText {
  @PrimaryColumn({ name: 'message_id' })
  messageId: number;

  @OneToOne(() => Message)
  @JoinColumn({ name: 'message_id' })
  message: Message;

  @Column()
  text: string;
}
