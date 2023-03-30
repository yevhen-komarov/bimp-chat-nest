import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { RegisterDto } from './dto/register.dto';
import { User } from 'src/entities/user.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async register(dto: RegisterDto) {
    const user = this.userRepository.create({
      username: dto.username,
      password: await bcrypt.hash(dto.password, 10),
    });

    return await this.userRepository.save(user);
  }

  async validate(username: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { username },
      select: {
        id: true,
        username: true,
        password: true,
        createdAt: true,
      },
    });

    if (user) {
      return (await bcrypt.compare(password, user?.password)) ? user : null;
    } else {
      return user;
    }
  }
}
