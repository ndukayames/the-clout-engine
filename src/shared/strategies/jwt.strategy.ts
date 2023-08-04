import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: configService.get('COGNITO_CLIENT_ID'),
      issuer: configService.get('COGNITO_ISSUER'),
      algorithms: ['RS256'],
      secretOrKeyProvider: passportJwtSecret({
        cache: false,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: configService.get('COGNITO_JWKS_URI'),
      }),
    });
  }

  async validate(payload: {
    sub: string;
    email: string;
    'cognito:username': string;
  }) {
    const user = await this.userService.findUser(
      payload['cognito:username'],
      payload.email,
    );
    return user;
  }
}
