import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import {
  CreateNetworkRegionDto,
  NetworkRegionListQueryDto,
  UpdateNetworkRegionDto,
} from "./dto/network-region.dto";
import { NetworkRegion } from "./network-region.schema";

@Injectable()
export class NetworkRegionService {
  constructor(
    @InjectModel("NetworkRegion")
    private readonly networkRegionModel: Model<NetworkRegion>,
    @InjectModel("NetworkAddress")
    private readonly networkAddressModel: Model<any>,
  ) {}

  async create(dto: CreateNetworkRegionDto) {
    const exists = await this.networkRegionModel.findOne({
      name: { $regex: `^${dto.name.trim()}$`, $options: "i" },
    });
    if (exists) {
      throw new ConflictException("Region already exists.");
    }
    const doc = new this.networkRegionModel({
      name: dto.name.trim(),
      status: dto.status ?? true,
    });
    return doc.save();
  }

  async findAll(query: NetworkRegionListQueryDto) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
    const sortField = query.sort || "createdAt";
    const direction = query.direction === "asc" ? 1 : -1;
    const sort: Record<string, 1 | -1> = { [sortField]: direction };
    const filter: Record<string, unknown> = {};
    if (query.name?.trim()) {
      filter.name = { $regex: query.name.trim(), $options: "i" };
    }

    const [results, total] = await Promise.all([
      this.networkRegionModel
        .find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .exec(),
      this.networkRegionModel.countDocuments(filter).exec(),
    ]);

    return { results, total, page, limit };
  }

  async findList(status?: boolean) {
    const filter: Record<string, unknown> = {};
    if (typeof status === "boolean") filter.status = status;
    return this.networkRegionModel.find(filter).sort({ name: 1 }).lean().exec();
  }

  async update(id: string, dto: UpdateNetworkRegionDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException("Invalid region ID.");
    }
    if (dto.name?.trim()) {
      const exists = await this.networkRegionModel.findOne({
        _id: { $ne: new Types.ObjectId(id) },
        name: { $regex: `^${dto.name.trim()}$`, $options: "i" },
      });
      if (exists) {
        throw new ConflictException("Region already exists.");
      }
    }
    const updated = await this.networkRegionModel
      .findByIdAndUpdate(
        id,
        {
          ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
          ...(dto.status !== undefined ? { status: dto.status } : {}),
        },
        { new: true },
      )
      .exec();
    if (!updated) throw new NotFoundException("Region not found.");
    return updated;
  }

  async delete(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException("Invalid region ID.");
    }
    const inUse = await this.networkAddressModel.countDocuments({
      regionId: new Types.ObjectId(id),
    });
    if (inUse > 0) {
      throw new BadRequestException(
        "Cannot delete region because addresses are assigned to it.",
      );
    }
    const deleted = await this.networkRegionModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException("Region not found.");
    return true;
  }
}
