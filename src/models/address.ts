import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsLatitude,
  IsLongitude,
  IsOptional,
  IsPhoneNumber,
  IsPostalCode,
  MaxLength,
} from 'class-validator';

export class Address {
  @IsOptional()
  @MaxLength(50)
  @ApiPropertyOptional({
    type: String,
    maxLength: 50,
    description: 'Address friendly name',
  })
  name?: string;

  @MaxLength(2)
  @ApiProperty({
    type: String,
    required: true,
    maxLength: 2,
    description: 'Country ISO2 standard code',
    example: 'MX',
  })
  country: string;

  @MaxLength(2)
  @ApiProperty({
    type: String,
    required: true,
    maxLength: 2,
    description: 'State ISO2 standard code',
    example: 'SO',
  })
  state: string;

  @MaxLength(50)
  @ApiProperty({
    type: String,
    maxLength: 50,
    description: 'City',
    example: 'CAJEME',
  })
  city: string;

  @IsPostalCode()
  @MaxLength(5)
  @ApiProperty({
    type: String,
    required: true,
    maxLength: 5,
    description: 'Postal code',
    example: '85000',
  })
  postalCode: string;

  @MaxLength(50)
  @ApiProperty({
    type: String,
    required: true,
    maxLength: 50,
    description: 'Street name',
  })
  street: string;

  @MaxLength(10)
  @ApiProperty({
    type: String,
    required: true,
    maxLength: 10,
    description: 'Exterior number',
  })
  exteriorNumber: string;

  @IsOptional()
  @MaxLength(10)
  @ApiPropertyOptional({
    type: String,
    maxLength: 10,
    description: 'Interior number',
  })
  interiorNumber?: string;

  @IsOptional()
  @MaxLength(100)
  @ApiPropertyOptional({
    type: String,
    maxLength: 100,
    description: 'Between street names',
  })
  betweenStreets?: string;

  @IsOptional()
  @MaxLength(50)
  @ApiPropertyOptional({
    type: String,
    maxLength: 50,
    description: 'Suburb name',
  })
  suburb?: string;

  @IsOptional()
  @MaxLength(100)
  @ApiPropertyOptional({
    type: String,
    maxLength: 100,
    description: 'Additional instructions',
  })
  indications?: string;

  @IsOptional()
  @IsLatitude()
  @ApiPropertyOptional({ type: Number, description: 'Latitude (geographical coordinates)' })
  latitude?: number;

  @IsOptional()
  @IsLongitude()
  @ApiPropertyOptional({ type: Number, description: 'Longitude (geographical coordinates)' })
  longitude?: number;

  @IsOptional()
  @IsPhoneNumber()
  @ApiPropertyOptional({ type: Number, description: 'Phone number' })
  telephone?: string;
}
