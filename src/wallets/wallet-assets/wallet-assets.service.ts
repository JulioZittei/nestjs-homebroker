import { Injectable } from '@nestjs/common';
import { WalletAsset } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma/prisma.service';

@Injectable()
export class WalletAssetsService {
  constructor(private prismaService: PrismaService) {}

  async all(filter: { wallet_id: string }): Promise<WalletAsset[]> {
    return await this.prismaService.walletAsset.findMany({
      where: {
        wallet_id: filter.wallet_id,
      },
      include: {
        Asset: {
          select: {
            id: true,
            symbol: true,
            price: true,
          },
        },
      },
    });
  }

  async create(input: {
    wallet_id: string;
    asset_id: string;
    shares: number;
  }): Promise<WalletAsset> {
    return await this.prismaService.walletAsset.create({
      data: {
        ...input,
        version: 1,
      },
    });
  }
}
