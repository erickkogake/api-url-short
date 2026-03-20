import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl, MaxLength } from 'class-validator';

export class CreateShortUrlDto {
  @ApiProperty({
    example: 'https://www.example.com/some/long/url',
    description: 'URL original para ser encurtada',
  })
  @IsNotEmpty()
  @IsUrl(
    {
      require_protocol: true,
    },
    {
      message: 'A URL deve ser uma URL válida com protocolo.',
    },
  )
  @MaxLength(2048)
  url: string;
}
