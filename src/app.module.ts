import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccountModule } from './account/account.module';
import { BasicStrategy } from './basic.strategy';
import { MessageFile } from './entities/message-file.entity';
import { MessageText } from './entities/message-text.entity';
import { Message } from './entities/message.entity';
import { User } from './entities/user.entity';
import { MessageModule } from './message/message.module';

@Module({
  imports: [
    PassportModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [User, Message, MessageText, MessageFile],
      extra: {
        charset: 'utf8mb4_unicode_ci',
      },
      synchronize: true,
      logging: false,
    }),
    MessageModule,
    AccountModule,
  ],
  providers: [BasicStrategy],
})
export class AppModule {}
