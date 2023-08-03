import { HttpException, HttpStatus } from '@nestjs/common';

export class DuplicateResourceException extends HttpException {
  constructor(
    message?: string,
    private resource?: string,
    private resourceValue?: string,
  ) {
    let errMsg = 'Duplicate Exception';
    if (resource && resourceValue) {
      errMsg = `Resource ${resource} with value ${resourceValue} already exists.`;
    } else {
      errMsg = message;
    }
    super(errMsg, HttpStatus.BAD_REQUEST);
  }
}
