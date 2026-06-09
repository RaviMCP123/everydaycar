import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  BookRepairListQueryDto,
  CreateBookRepairDto,
} from "./dto/book-repair.dto";
import { BookRepairSubmission } from "./book-repair.schema";

@Injectable()
export class BookRepairService {
  constructor(
    @InjectModel("BookRepairSubmission")
    private readonly bookRepairModel: Model<BookRepairSubmission>,
  ) {}

  async create(dto: CreateBookRepairDto): Promise<BookRepairSubmission> {
    const doc = new this.bookRepairModel(dto);
    return doc.save();
  }

  async findAll(query: BookRepairListQueryDto): Promise<{
    results: Record<string, unknown>[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
    const sortField = query.sort || "createdAt";
    const direction = query.direction === "asc" ? 1 : -1;
    const sort: Record<string, 1 | -1> = { [sortField]: direction };

    const filter: Record<string, unknown> = {};
    if (query.name?.trim()) {
      filter.fullName = {
        $regex: query.name.trim(),
        $options: "i",
      };
    }
    if (query.mobileNumber?.trim()) {
      filter.mobileNumber = {
        $regex: query.mobileNumber.trim(),
        $options: "i",
      };
    }
    if (query.createdAt?.trim()) {
      const [start, end] = query.createdAt.split("TO");
      if (start && end) {
        const startDate = new Date(`${start}T00:00:00.000Z`);
        const endDate = new Date(`${end}T23:59:59.999Z`);
        if (
          !Number.isNaN(startDate.getTime()) &&
          !Number.isNaN(endDate.getTime())
        ) {
          filter.createdAt = { $gte: startDate, $lte: endDate };
        }
      }
    }

    const [results, total] = await Promise.all([
      this.bookRepairModel
        .find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .exec(),
      this.bookRepairModel.countDocuments(filter).exec(),
    ]);

    return {
      results: results as Record<string, unknown>[],
      total,
      page,
      limit,
    };
  }

  async updateStatus(id: string, status: "new" | "in_progress" | "completed") {
    const updated = await this.bookRepairModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .lean()
      .exec();

    if (!updated) {
      throw new NotFoundException("Book repair request not found.");
    }

    return updated;
  }
}
