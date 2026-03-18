import { Injectable } from '@nestjs/common';
import { ShortCodeGeneratorService } from '../../domain/services/short-code-generator.service';

@Injectable()
export class RandomShortCodeGeneratorService
  implements ShortCodeGeneratorService
{
  private readonly chars =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  generate(length = 6): string {
    let result = '';

    for (let i = 0; i < length; i++) {
      const index = Math.floor(Math.random() * this.chars.length);
      result += this.chars[index];
    }

    return result;
  }
}