import { ApiPropertyOptional } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, Max, Min } from 'class-validator';

export class PaginationDto {
  @IsInt()
  @Type(() => Number)
  @Max(100)
  @IsPositive()
  @IsOptional()
  @ApiPropertyOptional({ default: 20, maximum: 100 })
  take?: number = 20;

  @IsInt()
  @Type(() => Number)
  @Min(0)
  @IsOptional()
  @ApiPropertyOptional({ default: 0, minimum: 0 })
  skip?: number = 0;
}
