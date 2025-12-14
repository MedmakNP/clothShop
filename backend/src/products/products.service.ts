// src/products/products.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { AddProductImageDto } from './dto/add-product-image.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  // Список товарів
  findAll() {
    return this.prisma.product.findMany({
      where: { isActive: true },
      include: {
        images: true,
        variants: true,
        category: true,
      },
      orderBy: { id: 'asc' },
    });
  }

  // Один товар по slug
  findBySlug(slug: string) {
    return this.prisma.product.findFirst({
      where: { slug, isActive: true },
      include: {
        images: true,
        variants: true,
        category: true,
      },
    });
  }
  async addImage(productId: number, dto: AddProductImageDto) {
    return this.prisma.productImage.create({
      data: {
        productId,
        url: dto.url,
        sortOrder: dto.sortOrder ?? 0,
        variantId: dto.variantId ?? null,
      },
    });
  }

  // Створення товару (для адмінки)
  async create(dto: CreateProductDto) {
    // 1. Шукаємо / створюємо категорію, якщо передана назва
    let categoryId: number | undefined;

    if (dto.categoryName?.trim()) {
      const slug = dto.categoryName.trim().toLowerCase().replace(/\s+/g, '-');

      const category = await this.prisma.category.upsert({
        where: { slug },
        update: {},
        create: {
          name: dto.categoryName.trim(),
          slug,
        },
      });

      categoryId = category.id;
    }

    // 2. Створюємо продукт
    const product = await this.prisma.product.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        basePrice: dto.basePrice,
        description: dto.description ?? null,
        isActive: true,

        // ✅ якщо є категорія — підʼєднуємо relation
        ...(categoryId && {
          category: {
            connect: { id: categoryId },
          },
        }),

        images: dto.imageUrl
          ? {
              create: {
                url: dto.imageUrl,
                sortOrder: 0,
              },
            }
          : undefined,

        variants:
          dto.variants && dto.variants.length
            ? {
                create: dto.variants.map((v) => ({
                  sku: v.sku,
                  size: v.size,
                  color: v.color,
                  price: v.price ?? dto.basePrice,
                  stock: v.stock ?? 0,
                  isActive: true,
                })),
              }
            : undefined,
      },
      include: {
        images: true,
        variants: true,
        category: true,
      },
    });

    return product;
  }

  // Видалення
  remove(id: number) {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
