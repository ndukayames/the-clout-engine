import { IsString, MinLength } from 'class-validator';

export class ConfirmPasswordDto {
  @IsString()
  username: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  code: string;
}
