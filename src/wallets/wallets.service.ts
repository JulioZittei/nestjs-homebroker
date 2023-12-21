import { Injectable } from '@nestjs/common';
import { Wallet } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma/prisma.service';

@Injectable()
export class WalletsService {
  constructor(private prismaService: PrismaService) {}

  async all(): Promise<Wallet[]> {
    return await this.prismaService.wallet.findMany();
  }

  async create(input: { id: string }) {
    return await this.prismaService.wallet.create({
      data: {
        id: input.id,
      },
    });
  }
}
