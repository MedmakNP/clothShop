// prisma/seed.ts
import { PrismaClient, Role } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  // categories
  const hoodies = await prisma.category.upsert({
    where: { slug: 'hoodies' },
    update: {},
    create: { name: 'Hoodies', slug: 'hoodies' },
  });
  const tees = await prisma.category.upsert({
    where: { slug: 't-shirts' },
    update: {},
    create: { name: 'T-Shirts', slug: 't-shirts' },
  });

  // products
  const blackHoodie = await prisma.product.upsert({
    where: { slug: 'black-hoodie' },
    update: {},
    create: {
      name: 'Black Hoodie',
      slug: 'black-hoodie',
      description: 'Тепла худі, 80% cotton',
      basePrice: 1200,
      categoryId: hoodies.id,
      images: { create: [{ url: '/img/black-hoodie.jpg', sortOrder: 0 }] },
      variants: {
        create: [
          { sku: 'BH-S', size: 'S', color: 'black', price: 1200, stock: 10 },
          { sku: 'BH-M', size: 'M', color: 'black', price: 1200, stock: 12 },
          { sku: 'BH-L', size: 'L', color: 'black', price: 1200, stock: 8 },
        ],
      },
    },
  });

  const whiteTee = await prisma.product.upsert({
    where: { slug: 'white-tee' },
    update: {},
    create: {
      name: 'White Tee',
      slug: 'white-tee',
      description: 'Біла футболка, 100% cotton',
      basePrice: 450,
      categoryId: tees.id,
      images: { create: [{ url: '/img/white-tee.jpg', sortOrder: 0 }] },
      variants: {
        create: [
          { sku: 'WT-S', size: 'S', color: 'white', price: 450, stock: 20 },
          { sku: 'WT-M', size: 'M', color: 'white', price: 450, stock: 25 },
          { sku: 'WT-L', size: 'L', color: 'white', price: 450, stock: 18 },
        ],
      },
    },
  });

  // test user (customer)
  await prisma.user.upsert({
    where: { email: 'test@shop.local' },
    update: {},
    create: {
      email: 'test@shop.local',
      password: 'hashed-or-temp', // заміниш на реєстрацію/хеш пізніше
      role: Role.CUSTOMER,
    },
  });

  console.log('Seed done:', { blackHoodie: blackHoodie.id, whiteTee: whiteTee.id });
}

run()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
