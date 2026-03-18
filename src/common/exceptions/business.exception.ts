import { HttpException, HttpStatus } from '@nestjs/common';

export class BusinessException extends HttpException {
  constructor(message: string, statusCode = HttpStatus.BAD_REQUEST) {
    super(
      {
        message,
        error: 'Regra de negócio violada',
        statusCode,
      },
      statusCode,
    );
  }
}