import { Body, Controller, Get, Post } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { Asset } from '@prisma/client';

@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get()
  async all(): Promise<Asset[]> {
    return await this.assetsService.all();
  }

  @Post()
  async create(
    @Body() body: { id: string; symbol: string; price: number },
  ): Promise<Asset> {
    return await this.assetsService.create(body);
  }
}
