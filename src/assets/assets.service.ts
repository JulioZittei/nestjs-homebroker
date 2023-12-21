import { Injectable } from '@nestjs/common';
import { Asset } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma/prisma.service';

@Injectable()
export class AssetsService {
  constructor(private prismaService: PrismaService) {}

  async all(): Promise<Asset[]> {
    return await this.prismaService.asset.findMany();
  }

  async create(data: {
    id: string;
    symbol: string;
    price: number;
  }): Promise<Asset> {
    return await this.prismaService.asset.create({
      data,
    });
  }
}
