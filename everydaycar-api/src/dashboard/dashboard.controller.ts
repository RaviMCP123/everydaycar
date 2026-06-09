import { Controller, Get, HttpStatus, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Response } from "express";
import { I18n, I18nContext } from "nestjs-i18n";
import { AccountActiveGuard } from "../auth/jwt.guard";
import { DashboardService } from "./dashboard.service";

@Controller("dashboard")
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get("stats")
  @UseGuards(AuthGuard("jwt"), AccountActiveGuard)
  async getStats(@Res() res: Response, @I18n() i18n: I18nContext) {
    const stats = await this.dashboardService.getStats();
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: i18n.t("messages.DATA_RECEIVED"),
      data: stats,
    });
  }
}
