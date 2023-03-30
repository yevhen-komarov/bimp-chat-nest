import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty({ minLength: 3 })
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty({ minLength: 3 })
  password: string;
}
