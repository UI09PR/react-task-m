import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty({ message: 'Text is required' })
  @MinLength(1, { message: 'Text must be at least 1 characters long' })
  text: string;

  @IsBoolean()
  @IsOptional()
  ready?: boolean;
}
