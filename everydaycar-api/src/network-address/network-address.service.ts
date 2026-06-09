import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import {
  CreateNetworkAddressDto,
  NetworkAddressListQueryDto,
  UpdateNetworkAddressDto,
} from "./dto/network-address.dto";
import { NetworkAddress } from "./network-address.schema";

@Injectable()
export class NetworkAddressService {
  constructor(
    @InjectModel("NetworkAddress")
    private readonly networkAddressModel: Model<NetworkAddress>,
    @InjectModel("NetworkRegion")
    private readonly networkRegionModel: Model<any>,
  ) {}

  private async ensureRegion(regionId: string) {
    if (!Types.ObjectId.isValid(regionId)) {
      throw new BadRequestException("Invalid region ID.");
    }
    const region = await this.networkRegionModel
      .findById(regionId)
      .lean()
      .exec();
    if (!region) throw new NotFoundException("Region not found.");
  }

  async create(dto: CreateNetworkAddressDto) {
    await this.ensureRegion(dto.regionId);
    const doc = new this.networkAddressModel({
      regionId: new Types.ObjectId(dto.regionId),
      address: dto.address,
      link: dto.link || "",
      statusText: dto.statusText || "Approved",
      latitude: dto.latitude,
      longitude: dto.longitude,
      status: dto.status ?? true,
    });
    return doc.save();
  }

  async findAll(query: NetworkAddressListQueryDto) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
    const sortField = query.sort || "createdAt";
    const direction = query.direction === "asc" ? 1 : -1;
    const sort: Record<string, 1 | -1> = { [sortField]: direction };
    const filter: Record<string, unknown> = {};
    if (query.regionId?.trim()) {
      if (!Types.ObjectId.isValid(query.regionId.trim())) {
        throw new BadRequestException("Invalid region ID.");
      }
      filter.regionId = new Types.ObjectId(query.regionId.trim());
    }
    if (query.addressText?.trim()) {
      filter.$or = [
        { "address.en": { $regex: query.addressText.trim(), $options: "i" } },
        { statusText: { $regex: query.addressText.trim(), $options: "i" } },
      ];
    }

    const [results, total] = await Promise.all([
      this.networkAddressModel
        .find(filter)
        .populate("regionId", "name status")
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .exec(),
      this.networkAddressModel.countDocuments(filter).exec(),
    ]);
    return { results, total, page, limit };
  }

  async findList(status?: boolean) {
    const filter: Record<string, unknown> = {};
    if (typeof status === "boolean") filter.status = status;
    return this.networkAddressModel
      .find(filter)
      .populate("regionId", "name status")
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }

  async findPublicList() {
    return this.networkAddressModel
      .find({ status: true })
      .populate("regionId", "name status")
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }

  async update(id: string, dto: UpdateNetworkAddressDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException("Invalid address ID.");
    }
    if (dto.regionId !== undefined) {
      await this.ensureRegion(dto.regionId);
    }
    const updated = await this.networkAddressModel
      .findByIdAndUpdate(
        id,
        {
          ...(dto.regionId !== undefined
            ? { regionId: new Types.ObjectId(dto.regionId) }
            : {}),
          ...(dto.address !== undefined ? { address: dto.address } : {}),
          ...(dto.link !== undefined ? { link: dto.link } : {}),
          ...(dto.statusText !== undefined
            ? { statusText: dto.statusText }
            : {}),
          ...(dto.latitude !== undefined ? { latitude: dto.latitude } : {}),
          ...(dto.longitude !== undefined ? { longitude: dto.longitude } : {}),
          ...(dto.status !== undefined ? { status: dto.status } : {}),
        },
        { new: true },
      )
      .populate("regionId", "name status")
      .exec();

    if (!updated) throw new NotFoundException("Address not found.");
    return updated;
  }

  async delete(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException("Invalid address ID.");
    }
    const deleted = await this.networkAddressModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException("Address not found.");
    return true;
  }
}
