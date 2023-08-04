import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { AwsSdkService } from 'src/aws-sdk/aws-sdk.service';
import { User, UserDoc } from './entity/user';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SignupDto } from 'src/auth/dto/signup.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UserService {
  cognito: CognitoIdentityServiceProvider;
  private userPoolId: string;
  private clientId: string;
  constructor(
    private aws: AwsSdkService,
    @InjectModel(User.name) private userModel: Model<User>,
    private configService: ConfigService,
  ) {
    this.cognito = aws.getCognito();
    this.userPoolId = this.configService.get('COGNITO_USER_POOL_ID');
    this.clientId = this.configService.get('COGNITO_CLIENT_ID');
  }

  async createUserProfileDetails(dto: SignupDto) {
    return await this.userModel.create({
      email: dto.email,
      fullName: dto.full_name,
      username: dto.username,
    });
  }
  async findUser(username: string, email?: string): Promise<UserDoc | null> {
    const user = await this.userModel.findOne({
      $or: [{ username: username }, { email: email ?? username }],
    });

    return user;
  }

  async getProfileDetails(username: string): Promise<UserDoc | null> {
    const user = await this.findUser(username);
    return user;
  }
  async updateUser(
    username: string,
    dto: UpdateUserProfileDto,
  ): Promise<UserDoc | null> {
    const user = await this.findUser(username);

    Object.keys(dto).forEach((key) => {
      if (dto[key] !== null) {
        user[key] = dto[key];
      }
    });
    await user.save();

    return user;
  }

  async changePassword(username: string, dto: ChangePasswordDto) {
    await this.cognito
      .adminSetUserPassword({
        Password: dto.password,
        Username: username,
        UserPoolId: this.userPoolId,
        Permanent: true,
      })
      .promise();

    return 'password changed successfully.';
  }
}
