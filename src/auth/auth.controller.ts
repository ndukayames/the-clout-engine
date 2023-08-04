import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { SignInDto } from './dto/signnin.dto';
import { SignupConfirmationDto } from './dto/signup-confirmation.dto';
import { IsNotEmpty } from 'class-validator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signupUser(@Body() dto: SignupDto) {
    return this.authService.signupUser(dto);
  }

  @Post('signup/confirm')
  @HttpCode(200)
  async confirmSignUp(@Body() dto: SignupConfirmationDto) {
    return this.authService.confirmSignUp(dto);
  }

  @Post('signup/confirm/resend')
  @HttpCode(200)
  async resendConfirmationCode(@Body('username') username: string) {
    return this.authService.resendConfirmationCode(username);
  }

  @Post('signin')
  @HttpCode(200)
  async loginUser(@Body() dto: SignInDto) {
    return this.authService.loginUser(dto);
  }
}
