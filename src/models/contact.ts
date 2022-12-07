import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsPhoneNumber, MaxLength } from 'class-validator';

export class Contact {
  @MaxLength(50)
  @ApiPropertyOptional({
    type: String,
    maxLength: 50,
    description: 'Friendly contact name',
  })
  name?: string;

  @IsEmail()
  @ApiPropertyOptional({ type: String, format: 'email', description: 'Email' })
  email?: string;

  @IsOptional()
  @IsPhoneNumber()
  @ApiPropertyOptional({
    type: String,
    // eslint-disable-next-line prettier/prettier
    pattern: '^(+d{1,2}s)?(?d{3})?[s.-]?d{3}[s.-]?d{4}$',
    description: 'Phone number',
  })
  phone?: string;
}
