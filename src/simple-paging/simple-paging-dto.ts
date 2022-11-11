import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, MaxLength, Min } from 'class-validator';
import { IEntity, IWherePropParam } from 'fireorm';
import { SortDirection } from './simple-paging';

export class SimplePagingDto<T extends IEntity> {
  @IsOptional()
  @MaxLength(50)
  @ApiProperty({ type: String, maxLength: 50 })
  cursor?: string;

  @IsOptional()
  @Min(1)
  @ApiProperty({ type: Number, minimum: 1 })
  offset?: number;

  @IsOptional()
  @Min(5)
  @ApiProperty({ type: Number, minimum: 5 })
  limit?: number;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  @ApiProperty({
    type: String,
    enum: ['asc', 'desc'],
  })
  direction?: SortDirection

  @IsOptional()
  @ApiProperty({ type: String })
  sort?: IWherePropParam<T>;

}