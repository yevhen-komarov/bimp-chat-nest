import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Message } from 'src/entities/message.entity';
import { User } from 'src/entities/user.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  createText(user: User, text: string) {
    return this.messageRepository.save({
      userId: user.id,
      messageText: {
        text,
      },
    });
  }

  createFile(
    user: User,
    { filename, mimetype, originalname }: Express.Multer.File,
  ) {
    return this.messageRepository.save({
      userId: user.id,
      messageFile: {
        filename,
        mimetype,
        originalname,
      },
    });
  }

  getList(take: number = 20, skip: number = 0) {
    return this.messageRepository.find({
      take,
      skip,
      relations: {
        user: true,
        messageFile: true,
        messageText: true,
      },
      order: {
        id: 'desc',
      },
    });
  }

  getMessage(id: number) {
    return this.messageRepository.findOne({
      where: { id },
      relations: {
        messageFile: true,
        messageText: true,
      },
    });
  }
}
