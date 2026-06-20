import { ArrayMaxSize, IsArray, IsString, MaxLength } from "class-validator";

export class GeocodeBatchDto {
  @IsArray()
  @ArrayMaxSize(50)
  @IsString({ each: true })
  @MaxLength(500, { each: true })
  queries!: string[];
}
