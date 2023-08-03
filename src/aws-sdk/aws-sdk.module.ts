import { Global, Module } from '@nestjs/common';
import { AwsSdkService } from './aws-sdk.service';

@Global()
@Module({
  providers: [AwsSdkService],
  exports: [AwsSdkService],
})
export class AwsSdkModule {}
