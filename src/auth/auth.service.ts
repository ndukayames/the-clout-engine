import { Injectable } from '@nestjs/common';
import { AwsSdkService } from 'src/aws-sdk/aws-sdk.service';
import { SignupDto } from './dto/signup.dto';
import { ConfigService } from '@nestjs/config';
import { SignInDto } from './dto/signnin.dto';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { SignupConfirmationDto } from './dto/signup-confirmation.dto';
import { UserService } from 'src/user/user.service';
import { DuplicateResourceException } from 'src/shared/exceptions/duplicate-resource.exception';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ConfirmPasswordDto } from './dto/forgot-password-confirmation.dto';

@Injectable()
export class AuthService {
  cognito: CognitoIdentityServiceProvider;
  private userPoolId: string;
  private clientId: string;
  constructor(
    private aws: AwsSdkService,
    private configService: ConfigService,
    private userService: UserService,
  ) {
    this.cognito = aws.getCognito();
    this.userPoolId = this.configService.get('COGNITO_USER_POOL_ID');
    this.clientId = this.configService.get('COGNITO_CLIENT_ID');
  }

  async signupUser(dto: SignupDto) {
    const existingUser = await this.userService.findUser(
      dto.username,
      dto.email,
    );
    if (existingUser)
      throw new DuplicateResourceException('username not available.');

    const newUser = await this.userService.createUserProfileDetails(dto);

    await this.cognito
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

    newUser.isUserEnabled = true;
    await newUser.save();

    return 'Account created, please verify email';
  }

  async resendConfirmationCode(username: string) {
    const existingUser = await this.userService.findUser(username);
    if (existingUser.isEmailVerified === false) {
      await this.cognito
        .resendConfirmationCode({
          Username: username,
          ClientId: this.clientId,
        })
        .promise();

      return 'confirmation code sent.';
    }
    return 'account already confirmed';
  }

  async confirmSignUp(dto: SignupConfirmationDto): Promise<string> {
    const existingUser = await this.userService.findUser(dto.username);

    if (existingUser.isEmailVerified === false) {
      await this.cognito
        .confirmSignUp({
          ClientId: this.clientId,
          Username: dto.username,
          ConfirmationCode: dto.code,
        })
        .promise();
      existingUser.isEmailVerified = true;
      await existingUser.save();
    }

    return 'email verification successful.';
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

  async forgotPassword(dto: ForgotPasswordDto): Promise<string> {
    await this.cognito
      .forgotPassword({
        ClientId: this.clientId,
        Username: dto.username,
      })
      .promise();

    return 'confirmation code sent to your email.';
  }

  async confirmPassword(dto: ConfirmPasswordDto): Promise<string> {
    await this.cognito
      .confirmForgotPassword({
        ClientId: this.clientId,
        ConfirmationCode: dto.code,
        Password: dto.password,
        Username: dto.username,
      })
      .promise();

    return 'password changed.';
  }
}
