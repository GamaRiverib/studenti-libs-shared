import { UnauthorizedException } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AuthException extends UnauthorizedException {
  static MESSAGE = 'Auth exception';
  constructor(description?: string) {
    super(AuthException.MESSAGE);
    this.description = description;
  }

  @ApiPropertyOptional({ type: String, description: 'Exception cause' })
  description?: string;

  @ApiProperty({ type: Number, description: 'HTTP response status code' })
  statusCode: number;

  @ApiProperty({ type: String, description: 'Error message' })
  message: string;

  @ApiProperty({ type: String, description: 'Error code or name' })
  error: string;
}