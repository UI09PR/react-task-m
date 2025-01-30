import { IsNumberString, IsOptional } from 'class-validator';

export class BasePaginationRequestDto {
  @IsNumberString()
  @IsOptional()
  limit?: string;

  @IsNumberString()
  @IsOptional()
  page?: string;
}
