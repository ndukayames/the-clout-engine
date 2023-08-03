import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { AwsSdkService } from 'src/aws-sdk/aws-sdk.service';
import { User } from './entity/user';

@Injectable()
export class UserService {
  cognito: CognitoIdentityServiceProvider;
  private userPoolId: string;
  private clientId: string;
  constructor(
    private aws: AwsSdkService,
    private configService: ConfigService,
  ) {
    this.cognito = aws.getCognito();
    this.userPoolId = this.configService.get('COGNITO_USER_POOL_ID');
    this.clientId = this.configService.get('COGNITO_CLIENT_ID');
  }

  async getProfileDetails(username: string) {
    const details = await this.cognito
      .adminGetUser({
        Username: username,
        UserPoolId: this.userPoolId,
      })
      .promise();

    let email: string;
    let isEmailVerified = false;
    for (const attribute of details.UserAttributes) {
      if (attribute.Name.toLowerCase() === 'email') {
        email = attribute.Value;
        break;
      }
    }

    if (details.UserStatus.toLowerCase() === 'confirmed') {
      isEmailVerified = true;
    }

    const user = new User(
      email,
      details.Username,
      isEmailVerified,
      details.Enabled,
      details.UserCreateDate,
      details.UserLastModifiedDate,
    );
    return user;
  }
}
