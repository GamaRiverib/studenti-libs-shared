import { ApiProperty } from '@nestjs/swagger';
import { Max, MaxLength, Min } from 'class-validator';

export class State {
  @Min(1)
  @Max(6)
  @ApiProperty({
    type: Number,
    minimum: 1,
    maximum: 100,
    description: 'State code',
  })
  code: number;

  @MaxLength(50)
  @ApiProperty({
    type: String,
    required: true,
    maxLength: 50,
    description: 'State name',
  })
  name: string;

  @MaxLength(2)
  @ApiProperty({
    type: String,
    required: true,
    maxLength: 2,
    description: 'ISO2 standard code',
  })
  iso2: string;

  @MaxLength(10)
  @ApiProperty({
    type: String,
    required: true,
    maxLength: 10,
    description: 'State abbreviate name',
  })
  abbrv?: string;
}
