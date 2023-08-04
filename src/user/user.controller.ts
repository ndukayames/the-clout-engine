import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getProfileDetails(@GetUser('username') username: string) {
    return this.userService.getProfileDetails(username);
  }

  @Patch()
  async updateProfile(
    @GetUser('username') username: string,
    @Body() dto: UpdateUserProfileDto,
  ) {
    return this.userService.updateUser(username, dto);
  }

  @Post('password')
  async updatePassword(
    @GetUser('username') username: string,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.userService.changePassword(username, dto);
  }
}
