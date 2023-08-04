import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { AwsSdkService } from 'src/aws-sdk/aws-sdk.service';
import { User } from './entity/user';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SignupDto } from 'src/auth/dto/signup.dto';

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
  async findUser(username: string, email?: string) {
    const user = await this.userModel.findOne({
      $or: [{ username: username }, { email: email ?? username }],
    });

    return user;
  }

  async getProfileDetails(username: string) {
    const user = this.findUser(username);
    return user;
  }

  // async editProfileDetails(
  //   username: string,
  //   newProfileData: UpdateUserProfileDto,
  // ) {
  //   const details = await this.cognito.adminUpdateUserAttributes({
  //     Username: username,
  //     UserAttributes: [
  //       {
  //         Name: 'custom:full_name',
  //       },
  //     ],
  //   });
  // }
}
