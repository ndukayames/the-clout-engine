import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { S3, config, CognitoIdentityServiceProvider } from 'aws-sdk';

@Injectable()
export class AwsSdkService {
  private s3: S3;
  private readonly logger = new Logger(AwsSdkService.name);
  constructor(private configService: ConfigService) {
    config.update({
      accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
      region: configService.get('AWS_DEFAULT_REGION'),
    });
    this.s3 = new S3();
    this.logger.debug('S3 Initialized');
  }

  getCognito(): CognitoIdentityServiceProvider {
    return new CognitoIdentityServiceProvider({
      region: this.configService.get('AWS_DEFAULT_REGION'),
    });
  }
}
