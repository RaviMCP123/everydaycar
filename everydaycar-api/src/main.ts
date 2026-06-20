import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { I18nValidationExceptionFilter } from "nestjs-i18n";
import { existsSync, mkdirSync, readFileSync } from "fs";
import { join, resolve } from "path";
import * as dotenv from "dotenv";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/filters/all-exceptions.filter";
import { MongoExceptionFilter } from "./common/filters/mongo-exception.filter";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { AdminModule } from "./admin/admin.module";
import { PageModule } from "./page/page.module";
import { CmsModule } from "./cms/cms.module";
import { ContactModule } from "./contact/contact.module";
import { BookRepairModule } from "./book-repair/book-repair.module";
import { NetworkRegionModule } from "./network-region/network-region.module";
import { NetworkAddressModule } from "./network-address/network-address.module";
import { GeocodeModule } from "./geocode/geocode.module";

dotenv.config();

async function bootstrap() {

    // SSL FILE LOCATION
  const httpsOptions = {
    key: readFileSync(
      '/home/quities/ssl/private/api.everydaycarrepair.com.au.key',
    ),
    cert: readFileSync(
      '/home/quities/ssl/cert/api.everydaycarrepair.com.au.crt',
    ),
    ca: readFileSync(
      '/home/quities/ssl/cert/api.everydaycarrepair.com.au-ca.crt',
    ),
  };
  const app = await NestFactory.create<NestExpressApplication>(AppModule,{
          httpsOptions,
  });
  const publicDir = resolve(process.cwd(), "public");
  const userDir = join(publicDir, "user");
  const userThumbDir = join(userDir, "thumb");
  const uploadsDir = join(publicDir, "uploads");

  if (!existsSync(userDir)) {
    mkdirSync(userDir, { recursive: true });
  }
  if (!existsSync(userThumbDir)) {
    mkdirSync(userThumbDir, { recursive: true });
  }
  if (!existsSync(uploadsDir)) {
    mkdirSync(uploadsDir, { recursive: true });
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableCors();
  app.useStaticAssets(publicDir);
  app.setGlobalPrefix("api");
  app.setViewEngine("ejs");

  app.use((req, res, next) => {
    if (req.path === "/") {
      return res.sendFile(join(__dirname, "..", "view", "index.html"));
    }
    next();
  });

  app.useGlobalFilters(new MongoExceptionFilter());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new I18nValidationExceptionFilter());

  const swaggerConfig = new DocumentBuilder()
    .setTitle("Everydaycar Admin API")
    .setDescription(
      "Authentication, CMS categories, static pages, profile, and admin settings.",
    )
    .setVersion("1.0")
    .addBearerAuth()
    .addApiKey(
      { type: "apiKey", name: "X-USER-TOKEN", in: "header" },
      "X-USER-TOKEN",
    )
    .addApiKey(
      { type: "apiKey", name: "x-access-token", in: "header" },
      "x-access-token",
    )
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    include: [
      AuthModule,
      UsersModule,
      AdminModule,
      PageModule,
      CmsModule,
      ContactModule,
      BookRepairModule,
      NetworkRegionModule,
      NetworkAddressModule,
      GeocodeModule,
    ],
    deepScanRoutes: true,
  });
  SwaggerModule.setup("api/docs", app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Everydaycar API listening on port ${port} (global prefix /api)`);
}
bootstrap();
