import { HttpStatus } from '@nestjs/common';
import { BusinessException } from './business.exception';

export class ShortCodeGenerationException extends BusinessException {
  constructor() {
    super(
      'Não foi possível gerar um código curto exclusivo.',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}