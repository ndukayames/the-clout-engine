import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { SignInDto } from './dto/signnin.dto';
import { SignupConfirmationDto } from './dto/signup-confirmation.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signupUser(@Body() dto: SignupDto) {
    return this.authService.signupUser(dto);
  }

  @Post('confirm-signup')
  @HttpCode(200)
  async confirmSignUp(@Body() dto: SignupConfirmationDto) {
    return this.authService.confirmSignUp(dto);
  }

  @Post('signin')
  @HttpCode(200)
  async loginUser(@Body() dto: SignInDto) {
    return this.authService.loginUser(dto);
  }
}
