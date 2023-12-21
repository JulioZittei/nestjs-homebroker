import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma/prisma.service';
import { ExecuteTransactionDto, InitTransactionDto } from './order.dto';
import { Order, OrderStatus, OrderType } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prismaService: PrismaService) {}

  async all(filter: { wallet_id: string }) {
    return this.prismaService.order.findMany({
      where: {
        wallet_id: filter.wallet_id,
      },
      include: {
        Transaction: true,
        Asset: {
          select: {
            id: true,
            symbol: true,
          },
        },
      },
      orderBy: {
        updated_at: 'desc',
      },
    });
  }

  async initTransaction(input: InitTransactionDto): Promise<Order> {
    return await this.prismaService.order.create({
      data: {
        ...input,
        partial: input.shares,
        status: OrderStatus.PENDING,
        version: 1,
      },
    });
  }

  async executeTransaction(input: ExecuteTransactionDto) {
    return this.prismaService.$transaction(async (prisma) => {
      const order = await prisma.order.findUniqueOrThrow({
        where: {
          id: input.order_id,
        },
      });

      await prisma.order.update({
        where: {
          id: input.order_id,
          version: order.version,
        },
        data: {
          partial: order.partial - input.negotiated_shares,
          status: input.status,
          version: { increment: 1 },
          Transaction: {
            create: {
              broker_transaction_id: input.broker_transaction_id,
              related_investor_id: input.related_investor_id,
              shares: input.negotiated_shares,
              price: input.price,
            },
          },
        },
      });

      if (input.status === OrderStatus.CLOSED) {
        await prisma.asset.update({
          where: { id: order.asset_id },
          data: { price: input.price },
        });

        const walletAsset = await prisma.walletAsset.findUnique({
          where: {
            wallet_id_asset_id: {
              asset_id: order.asset_id,
              wallet_id: order.wallet_id,
            },
          },
        });

        if (walletAsset) {
          await prisma.walletAsset.update({
            where: {
              wallet_id_asset_id: {
                asset_id: order.asset_id,
                wallet_id: order.wallet_id,
              },
              version: walletAsset.version,
            },
            data: {
              shares:
                order.type === OrderType.BUY
                  ? walletAsset.shares + order.shares
                  : walletAsset.shares - order.shares,
              version: { increment: 1 },
            },
          });
        } else {
          await prisma.walletAsset.create({
            data: {
              asset_id: order.id,
              wallet_id: order.wallet_id,
              shares: input.negotiated_shares,
              version: 1,
            },
          });
        }
      }
    });
  }
}
