import { Type } from "class-transformer";
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  IsNumber,
} from "class-validator";

export class CreateNetworkRegionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}

export class UpdateNetworkRegionDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name?: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}

export class UpdateNetworkRegionStatusDto {
  @IsBoolean()
  status: boolean;
}

export class NetworkRegionListQueryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  sort?: string = "createdAt";

  @IsOptional()
  direction?: "asc" | "desc" = "desc";

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  limit?: number = 10;
}
