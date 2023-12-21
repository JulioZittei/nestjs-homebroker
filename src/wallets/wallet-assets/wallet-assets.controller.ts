import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { WalletAssetsService } from './wallet-assets.service';
import { WalletAsset } from '@prisma/client';

@Controller('wallets/:wallet_id/assets')
export class WalletAssetsController {
  constructor(private walletAssetsService: WalletAssetsService) {}

  @Get()
  async all(@Param('wallet_id') wallet_id: string): Promise<WalletAsset[]> {
    return await this.walletAssetsService.all({ wallet_id });
  }

  @Post()
  async create(
    @Param('wallet_id') wallet_id: string,
    @Body() body: { asset_id: string; shares: number },
  ): Promise<WalletAsset> {
    return await this.walletAssetsService.create({
      wallet_id,
      ...body,
    });
  }
}
