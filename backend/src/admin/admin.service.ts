import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  // 📦 Отримати склад (по варіантах)
  getInventory() {
    return this.prisma.productVariant.findMany({
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            isActive: true,
          },
        },
      },
      orderBy: [{ productId: 'asc' }, { id: 'asc' }],
    });
  }

  // ✏️ Оновити залишок
  updateVariantStock(id: number, stock: number) {
    return this.prisma.productVariant.update({
      where: { id },
      data: { stock },
    });
  }
}
