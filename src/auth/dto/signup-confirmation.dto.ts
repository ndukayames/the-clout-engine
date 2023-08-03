import { IsString } from 'class-validator';

export class SignupConfirmationDto {
  @IsString()
  username: string;

  @IsString()
  code: string;
}
