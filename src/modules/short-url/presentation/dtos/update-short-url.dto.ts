import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl, MaxLength } from 'class-validator';

export class UpdateShortUrlDto {
  @ApiProperty({
    example: 'https://www.example.com/some/updated/url',
    description: 'Atualizado URL original',
  })
  @IsNotEmpty()
  @IsUrl(
    {
      require_protocol: true,
    },
    {
      message: 'A URL deve ser uma URL válida com protocolo',
    },
  )
  @MaxLength(2048)
  url: string;
}
