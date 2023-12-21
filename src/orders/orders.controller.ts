import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ExecuteTransactionDto, InitTransactionDto } from './order.dto';
import { Order } from '@prisma/client';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  all(@Param('wallet_id') walletId: string) {
    return this.ordersService.all({ wallet_id: walletId });
  }

  @Post()
  async initTransaction(
    @Param('wallet_id') walletId: string,
    @Body() body: Omit<InitTransactionDto, 'wallet_id'>,
  ): Promise<Order> {
    return await this.ordersService.initTransaction({
      ...body,
      wallet_id: walletId,
    });
  }

  @Post('execute')
  async executeTransaction(
    @Body() body: Omit<ExecuteTransactionDto, 'wallet_id'>,
  ) {
    return this.ordersService.executeTransaction(body);
  }
}
