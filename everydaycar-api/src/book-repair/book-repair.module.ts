import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersModule } from "../users/users.module";
import { BookRepairController } from "./book-repair.controller";
import BookRepairSubmissionSchema from "./book-repair.schema";
import { BookRepairService } from "./book-repair.service";

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: "BookRepairSubmission", schema: BookRepairSubmissionSchema },
    ]),
  ],
  controllers: [BookRepairController],
  providers: [BookRepairService],
})
export class BookRepairModule {}
