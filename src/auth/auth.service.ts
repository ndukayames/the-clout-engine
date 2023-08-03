import { Injectable } from '@nestjs/common';
import { AwsSdkService } from 'src/aws-sdk/aws-sdk.service';
import { SignupDto } from './dto/signup.dto';
import { ConfigService } from '@nestjs/config';
import { SignInDto } from './dto/signnin.dto';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { SignupConfirmationDto } from './dto/signup-confirmation.dto';

@Injectable()
export class AuthService {
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

  async signupUser(dto: SignupDto) {
    try {
      await this.cognito
        .adminGetUser({
          Username: dto.username,
          UserPoolId: this.userPoolId,
        })
        .promise();
    } catch (error) {}

    const request = await this.cognito
      .signUp({
        Username: dto.username,
        Password: dto.password,
        ClientId: this.clientId,
        UserAttributes: [
          {
            Name: 'email',
            Value: dto.email,
          },
        ],
      })
      .promise();

    return request;
  }

  async confirmSignUp(dto: SignupConfirmationDto): Promise<void> {
    await this.cognito
      .confirmSignUp({
        ClientId: this.clientId,
        Username: dto.username,
        ConfirmationCode: dto.code,
      })
      .promise();
  }

  async loginUser(dto: SignInDto) {
    await this.cognito
      .adminGetUser({
        Username: dto.username,
        UserPoolId: this.userPoolId,
      })
      .promise();

    const loginRequest = await this.cognito
      .initiateAuth({
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: this.clientId,
        AuthParameters: {
          USERNAME: dto.username,
          PASSWORD: dto.password,
        },
      })
      .promise();

    return loginRequest.AuthenticationResult;
  }
}
