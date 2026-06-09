import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from "@nestjs/common";
import { Response } from "express";
import { AuthGuard } from "@nestjs/passport";
import { AccountActiveGuard } from "../auth/jwt.guard";
import {
  CreateNetworkRegionDto,
  NetworkRegionListQueryDto,
  UpdateNetworkRegionDto,
  UpdateNetworkRegionStatusDto,
} from "./dto/network-region.dto";
import { NetworkRegionService } from "./network-region.service";

@Controller("network-region")
export class NetworkRegionController {
  constructor(private readonly service: NetworkRegionService) {}

  @Post()
  @UseGuards(AuthGuard("jwt"), AccountActiveGuard)
  async create(@Body() body: CreateNetworkRegionDto, @Res() res: Response) {
    const data = await this.service.create(body);
    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: "Region created successfully.",
      data,
    });
  }

  @Get()
  @UseGuards(AuthGuard("jwt"), AccountActiveGuard)
  async list(@Query() query: NetworkRegionListQueryDto, @Res() res: Response) {
    const data = await this.service.findAll(query);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "Regions received successfully.",
      data: {
        results: data.results,
        pagination: {
          total: data.total,
          page: data.page,
          currentPage: data.page,
          limit: data.limit,
        },
      },
    });
  }

  @Get("list")
  @UseGuards(AuthGuard("jwt"), AccountActiveGuard)
  async listAll(
    @Query("status") statusRaw: string | undefined,
    @Res() res: Response,
  ) {
    const status = statusRaw === undefined ? undefined : statusRaw === "true";
    const data = await this.service.findList(status);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "Regions received successfully.",
      data,
    });
  }

  @Put(":id")
  @UseGuards(AuthGuard("jwt"), AccountActiveGuard)
  async update(
    @Param("id") id: string,
    @Body() body: UpdateNetworkRegionDto,
    @Res() res: Response,
  ) {
    const data = await this.service.update(id, body);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "Region updated successfully.",
      data,
    });
  }

  @Patch(":id/status")
  @UseGuards(AuthGuard("jwt"), AccountActiveGuard)
  async updateStatus(
    @Param("id") id: string,
    @Body() body: UpdateNetworkRegionStatusDto,
    @Res() res: Response,
  ) {
    const data = await this.service.update(id, { status: body.status });
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "Region status updated successfully.",
      data,
    });
  }

  @Delete(":id")
  @UseGuards(AuthGuard("jwt"), AccountActiveGuard)
  async delete(@Param("id") id: string, @Res() res: Response) {
    await this.service.delete(id);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "Region deleted successfully.",
      data: {},
    });
  }
}
