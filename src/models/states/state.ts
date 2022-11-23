import { ApiProperty } from "@nestjs/swagger";
import { Max, MaxLength, Min } from "class-validator";

export class State {
  @Min(1)
  @Max(6)
  @ApiProperty({ type: Number, minimum: 1, maximum: 100 })
  code: number;

  @MaxLength(50)
  @ApiProperty({ type: String, required: true, maxLength: 50 })
  name: string;

  @MaxLength(2)
  @ApiProperty({ type: String, required: true, maxLength: 2 })
  iso2: string;

  @MaxLength(10)
  @ApiProperty({ type: String, required: true, maxLength: 10 })
  abbrv?: string;
}
