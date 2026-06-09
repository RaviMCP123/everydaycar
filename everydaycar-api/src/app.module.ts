import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import * as path from "path";
import {
  I18nModule,
  I18nJsonLoader,
  AcceptLanguageResolver,
} from "nestjs-i18n";
import { MongooseModule } from "@nestjs/mongoose";
import { APP_GUARD } from "@nestjs/core";
import { AppController } from "./app.controller";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { AdminModule } from "./admin/admin.module";
import { SettingsModule } from "./settings/settings.module";
import { PageModule } from "./page/page.module";
import { CmsModule } from "./cms/cms.module";
import { ContactModule } from "./contact/contact.module";
import { BookRepairModule } from "./book-repair/book-repair.module";
import { NetworkRegionModule } from "./network-region/network-region.module";
import { NetworkAddressModule } from "./network-address/network-address.module";
import { DashboardModule } from "./dashboard/dashboard.module";

/**
 * Everydaycar admin API — auth, CMS, profile, SMTP settings.
 */
const envFile =
  process.env.NODE_ENV === "production" ? ".env.production" : ".env";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(process.cwd(), envFile),
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    I18nModule.forRoot({
      fallbackLanguage: "en",
      loader: I18nJsonLoader,
      loaderOptions: {
        path: path.join(process.cwd(), "public/i18n"),
        watch: true,
      },
      resolvers: [AcceptLanguageResolver],
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL, {
      tlsAllowInvalidCertificates: true,
    }),
    UsersModule,
    AuthModule,
    AdminModule,
    PageModule,
    CmsModule,
    ContactModule,
    BookRepairModule,
    NetworkRegionModule,
    NetworkAddressModule,
    DashboardModule,
    SettingsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {
  constructor() {
    console.log(
      "Everydaycar API — loaded env:",
      path.resolve(process.cwd(), envFile),
    );
  }
}
