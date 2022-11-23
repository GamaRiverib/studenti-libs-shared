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
  @MaxLength(50)
  @ApiProperty({ type: String, required: true, maxLength: 50 })
  name: string;

  @MaxLength(2)
  @ApiProperty({ type: String, required: true, maxLength: 2 })
  country: string;

  @MaxLength(2)
  @ApiProperty({ type: String, required: true, maxLength: 2 })
  state: string;

  @MaxLength(50)
  @ApiProperty({ type: String, required: true, maxLength: 50 })
  city: string;

  @IsPostalCode()
  @MaxLength(5)
  @ApiProperty({ type: String, required: true, maxLength: 5 })
  postalCode: string;

  @MaxLength(50)
  @ApiProperty({ type: String, required: true, maxLength: 50 })
  street: string;

  @MaxLength(10)
  @ApiProperty({ type: String, required: true, maxLength: 10 })
  exteriorNumber: string;

  @IsOptional()
  @MaxLength(10)
  @ApiPropertyOptional({ type: String, maxLength: 10 })
  interiorNumber?: string;

  @IsOptional()
  @MaxLength(100)
  @ApiPropertyOptional({ type: String, maxLength: 100 })
  betweenStreets?: string;

  @IsOptional()
  @MaxLength(50)
  @ApiPropertyOptional({ type: String, maxLength: 50 })
  suburb?: string;

  @IsOptional()
  @MaxLength(100)
  @ApiPropertyOptional({ type: String, maxLength: 100 })
  indications?: string;

  @IsOptional()
  @IsLatitude()
  @ApiPropertyOptional({ type: Number })
  latitude?: number;

  @IsOptional()
  @IsLongitude()
  @ApiPropertyOptional({ type: Number })
  longitude?: number;

  @IsOptional()
  @IsPhoneNumber()
  @ApiPropertyOptional({ type: Number })
  telephone?: string;
}
