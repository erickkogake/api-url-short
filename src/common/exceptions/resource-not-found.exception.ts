import { HttpStatus } from '@nestjs/common';
import { BusinessException } from './business.exception';

export class ResourceNotFoundException extends BusinessException {
  constructor(resource = 'Resource') {
    super(`${resource} não encontrado`, HttpStatus.NOT_FOUND);
  }
}