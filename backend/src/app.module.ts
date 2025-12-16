import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseModule } from './supabase/supabase.module';
import { ProductsModule } from './products/products.module';
import { AdminModule } from './admin/admin.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // ← підхоплює .env
    SupabaseModule,
    ProductsModule,
    AdminModule,
    PrismaModule,
  ],
})
export class AppModule {}
