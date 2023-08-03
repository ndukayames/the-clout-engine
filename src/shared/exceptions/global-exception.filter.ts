import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionHandler implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionHandler.name);
  catch(exception: any, host: ArgumentsHost) {
    this.logger.debug(exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus ? exception.getStatus() : 500;
    const message =
      (exception.response && exception.response.message) ||
      exception.message ||
      'Internal server error';

    const errorResponse = {
      success: false,
      statusCode: status || 500,
      message: message,
      timestamp: new Date().toISOString(),
      path: ctx.getRequest().url,
    };

    response.status(status).json(errorResponse);
  }
}
