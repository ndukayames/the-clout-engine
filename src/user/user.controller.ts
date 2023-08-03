import { Controller, Get, Header, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { BearerToken } from 'src/shared/decorators/get-bearer-token.decorator';
import { GetUser } from 'src/shared/decorators/get-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile-details')
  async getProfileDetails(@GetUser('username') username: string) {
    return this.userService.getProfileDetails(username);
  }
}
