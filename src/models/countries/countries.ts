import { ApiProperty } from "@nestjs/swagger";
import { MaxLength } from "class-validator";

export class CountryDto {
  @MaxLength(3)
  @ApiProperty({ type: String, required: true, maxLength: 3 })
  code: string;

  @MaxLength(50)
  @ApiProperty({ type: String, required: true, maxLength: 50 })
  name: string;
}

export class Country {
  @MaxLength(50)
  @ApiProperty({ type: String, required: true, maxLength: 50 })
  name: string;
  
  @MaxLength(3)
  @ApiProperty({ type: String, required: true, maxLength: 3 })
  iso3: string;

  @MaxLength(2)
  @ApiProperty({ type: String, required: true, maxLength: 2 })
  iso2: string;

  @MaxLength(3)
  @ApiProperty({ type: String, required: true, maxLength: 3 })
  code: string;
}
