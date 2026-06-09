import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Response } from "express";
import { I18n, I18nContext } from "nestjs-i18n";
import { AccountActiveGuard } from "../auth/jwt.guard";
import {
  BookRepairListQueryDto,
  CreateBookRepairDto,
  UpdateBookRepairStatusDto,
} from "./dto/book-repair.dto";
import { BookRepairService } from "./book-repair.service";

@Controller("book-repair")
export class BookRepairController {
  constructor(private readonly bookRepairService: BookRepairService) {}

  @Post()
  async create(
    @Body() body: CreateBookRepairDto,
    @Res() res: Response,
    @I18n() i18n: I18nContext,
  ) {
    const saved = await this.bookRepairService.create(body);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: i18n.t("messages.DATA_RECEIVED"),
      data: { id: saved._id.toString() },
    });
  }

  @Get()
  @UseGuards(AuthGuard("jwt"), AccountActiveGuard)
  async list(
    @Query() query: BookRepairListQueryDto,
    @Res() res: Response,
    @I18n() i18n: I18nContext,
  ) {
    const { results, total, page, limit } =
      await this.bookRepairService.findAll(query);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: i18n.t("messages.DATA_RECEIVED"),
      data: {
        results,
        pagination: { total, page, currentPage: page, limit },
      },
    });
  }

  @Patch(":id/status")
  @UseGuards(AuthGuard("jwt"), AccountActiveGuard)
  async updateStatus(
    @Param("id") id: string,
    @Body() body: UpdateBookRepairStatusDto,
    @Res() res: Response,
    @I18n() i18n: I18nContext,
  ) {
    const updated = await this.bookRepairService.updateStatus(id, body.status);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: i18n.t("messages.DATA_UPDATED"),
      data: updated,
    });
  }
}
