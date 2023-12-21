import { Body, Controller, Get, Post } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { Wallet } from '@prisma/client';

@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Get()
  async all(): Promise<Wallet[]> {
    return await this.walletsService.all();
  }

  @Post()
  async create(@Body() body: { id: string }): Promise<Wallet> {
    return await this.walletsService.create(body);
  }
}
