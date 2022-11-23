import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsPhoneNumber, MaxLength } from 'class-validator';

export class Contact {
  @MaxLength(50)
  @ApiPropertyOptional({ type: String, maxLength: 50 })
  name?: string;

  @IsEmail()
  @ApiPropertyOptional({ type: String, format: 'email' })
  email?: string;

  @IsOptional()
  @IsPhoneNumber()
  @ApiPropertyOptional({
    type: String,
    // eslint-disable-next-line prettier/prettier
    pattern: '^(+d{1,2}s)?(?d{3})?[s.-]?d{3}[s.-]?d{4}$',
  })
  phone?: string;
}
