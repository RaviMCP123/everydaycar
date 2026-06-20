import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Res,
} from "@nestjs/common";
import { Response } from "express";
import { SkipThrottle } from "@nestjs/throttler";
import { GeocodeService } from "./geocode.service";
import { GeocodeBatchDto } from "./dto/geocode-batch.dto";

@SkipThrottle()
@Controller("geocode")
export class GeocodeController {
  constructor(private readonly geocodeService: GeocodeService) {}

  @Get("search")
  async search(@Query("q") query: string | undefined, @Res() res: Response) {
    const data = await this.geocodeService.searchAddress(query || "");
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "Geocode search completed.",
      data,
    });
  }

  @Post("search/batch")
  async searchBatch(@Body() body: GeocodeBatchDto, @Res() res: Response) {
    const data = await this.geocodeService.searchAddressesBatch(body.queries);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "Batch geocode search completed.",
      data,
    });
  }

  @Get("reverse")
  async reverse(
    @Query("lat") latRaw: string | undefined,
    @Query("lon") lonRaw: string | undefined,
    @Res() res: Response,
  ) {
    const latitude = Number(latRaw);
    const longitude = Number(lonRaw);
    const data = await this.geocodeService.reverseCoordinates(latitude, longitude);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "Reverse geocode completed.",
      data,
    });
  }
}
