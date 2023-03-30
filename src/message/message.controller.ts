import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBasicAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

import { Request, Response } from 'express';
import { createReadStream } from 'fs';
import { diskStorage } from 'multer';
import { join } from 'path';
import * as rawbody from 'raw-body';

import { PaginationDto } from './dto/pagination.dto';
import { MessageService } from './message.service';
import { User } from 'src/entities/user.entity';

type RequestWithUser = Request & { user: User };

@ApiTags('message')
@ApiBasicAuth()
@UseGuards(AuthGuard('basic'))
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @ApiConsumes('text/plain')
  @ApiBody({
    schema: {
      type: 'string',
    },
  })
  @Post('create/text')
  async createText(@Req() req: RequestWithUser) {
    if (!req.readable) throw new BadRequestException('Bad content type.');

    const raw = await rawbody(req);
    const text = raw.toString().trim();

    return this.messageService.createText(req.user, text);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/',
      }),
    }),
  )
  @Post('create/file')
  createFile(
    @Req() { user }: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.messageService.createFile(user, file);
  }

  @Get('list')
  getList(@Query() { take, skip }: PaginationDto) {
    return this.messageService.getList(take, skip);
  }

  @Get('content/:id')
  async getContent(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const message = await this.messageService.getMessage(id);

    if (!message) throw new NotFoundException('Message not found');

    if (message.messageText) {
      return res
        .status(200)
        .contentType('text/plain')
        .send(message.messageText.text);
    } else if (message.messageFile) {
      const file = createReadStream(
        join(process.cwd(), './uploads/', message.messageFile.filename),
      );
      res.contentType(message.messageFile.mimetype);
      file.pipe(res);
    } else {
      return res.status(200).send(null);
    }
  }
}
