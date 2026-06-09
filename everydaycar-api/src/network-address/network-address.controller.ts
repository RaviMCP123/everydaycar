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
  CreateNetworkAddressDto,
  NetworkAddressListQueryDto,
  UpdateNetworkAddressDto,
  UpdateNetworkAddressStatusDto,
} from "./dto/network-address.dto";
import { NetworkAddressService } from "./network-address.service";

@Controller("network-address")
export class NetworkAddressController {
  constructor(private readonly service: NetworkAddressService) {}

  @Post()
  @UseGuards(AuthGuard("jwt"), AccountActiveGuard)
  async create(@Body() body: CreateNetworkAddressDto, @Res() res: Response) {
    const data = await this.service.create(body);
    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: "Address created successfully.",
      data,
    });
  }

  @Get()
  @UseGuards(AuthGuard("jwt"), AccountActiveGuard)
  async list(@Query() query: NetworkAddressListQueryDto, @Res() res: Response) {
    const data = await this.service.findAll(query);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "Addresses received successfully.",
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
      message: "Addresses received successfully.",
      data,
    });
  }

  @Get("public")
  async listPublic(@Res() res: Response) {
    const data = await this.service.findPublicList();
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "Public addresses received successfully.",
      data,
    });
  }

  @Put(":id")
  @UseGuards(AuthGuard("jwt"), AccountActiveGuard)
  async update(
    @Param("id") id: string,
    @Body() body: UpdateNetworkAddressDto,
    @Res() res: Response,
  ) {
    const data = await this.service.update(id, body);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "Address updated successfully.",
      data,
    });
  }

  @Patch(":id/status")
  @UseGuards(AuthGuard("jwt"), AccountActiveGuard)
  async updateStatus(
    @Param("id") id: string,
    @Body() body: UpdateNetworkAddressStatusDto,
    @Res() res: Response,
  ) {
    const data = await this.service.update(id, { status: body.status });
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "Address status updated successfully.",
      data,
    });
  }

  @Delete(":id")
  @UseGuards(AuthGuard("jwt"), AccountActiveGuard)
  async delete(@Param("id") id: string, @Res() res: Response) {
    await this.service.delete(id);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "Address deleted successfully.",
      data: {},
    });
  }
}
