import { Type } from "class-transformer";
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from "class-validator";

export class CreateNetworkAddressDto {
  @IsString()
  @IsNotEmpty()
  regionId: string;

  @IsObject()
  address: Record<string, string>;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  link?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  statusText?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}

export class UpdateNetworkAddressDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  regionId?: string;

  @IsOptional()
  @IsObject()
  address?: Record<string, string>;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  link?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  statusText?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}

export class UpdateNetworkAddressStatusDto {
  @IsBoolean()
  status: boolean;
}

export class NetworkAddressListQueryDto {
  @IsOptional()
  @IsString()
  regionId?: string;

  @IsOptional()
  @IsString()
  addressText?: string;

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
