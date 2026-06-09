import {
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";
import { Type } from "class-transformer";

export class CreateBookRepairDto {
  @IsString()
  @MinLength(1)
  @MaxLength(40)
  accidentDate: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  accidentLocation: string;

  @IsString()
  @IsIn(["yes", "no", "not-sure"])
  driveable: "yes" | "no" | "not-sure";

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  accidentDescription?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(120)
  vehicleMake: string;

  @IsString()
  @MinLength(1)
  @MaxLength(120)
  vehicleModel: string;

  @IsString()
  @MinLength(1)
  @MaxLength(4)
  vehicleYear: string;

  @IsString()
  @MinLength(1)
  @MaxLength(40)
  registrationNumber: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  vehicleColour?: string;

  @IsString()
  @IsIn(["yes", "no"])
  otherDriverAtFault: "yes" | "no";

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  fullName: string;

  @IsString()
  @MinLength(1)
  @MaxLength(40)
  mobileNumber: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  callbackTime?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(120)
  suburb: string;
}

export class BookRepairListQueryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  mobileNumber?: string;

  @IsOptional()
  @IsString()
  createdAt?: string;

  @IsOptional()
  sort?: string = "createdAt";

  @IsOptional()
  direction?: "asc" | "desc" = "desc";

  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;
}

export class UpdateBookRepairStatusDto {
  @IsString()
  @IsIn(["new", "in_progress", "completed"])
  status: "new" | "in_progress" | "completed";
}
