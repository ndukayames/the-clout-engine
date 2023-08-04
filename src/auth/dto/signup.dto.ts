import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignupDto {
  @IsString()
  username: string;

  @IsString()
  full_name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
