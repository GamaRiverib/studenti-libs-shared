import { ApiProperty } from '@nestjs/swagger';
import { MaxLength } from 'class-validator';

export class CountryDto {
  @MaxLength(3)
  @ApiProperty({
    type: String,
    required: true,
    maxLength: 3,
    description: 'Country code',
  })
  code: string;

  @MaxLength(50)
  @ApiProperty({
    type: String,
    required: true,
    maxLength: 50,
    description: 'Country name',
  })
  name: string;
}

export class Country {
  @MaxLength(50)
  @ApiProperty({
    type: String,
    required: true,
    maxLength: 50,
    description: 'Country name',
  })
  name: string;

  @MaxLength(3)
  @ApiProperty({
    type: String,
    required: true,
    maxLength: 3,
    description: 'ISO3 standard code',
  })
  iso3: string;

  @MaxLength(2)
  @ApiProperty({
    type: String,
    required: true,
    maxLength: 2,
    description: 'ISO2 standard code',
  })
  iso2: string;

  @MaxLength(3)
  @ApiProperty({
    type: String,
    required: true,
    maxLength: 3,
    description: 'Country code',
  })
  code: string;
}
