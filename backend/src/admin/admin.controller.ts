import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // 📦 Склад
  @Get('inventory')
  getInventory() {
    return this.adminService.getInventory();
  }

  // ✏️ Оновити залишок
  @Patch('variants/:id/stock')
  updateStock(
    @Param('id', ParseIntPipe) id: number,
    @Body('stock') stock: number,
  ) {
    return this.adminService.updateVariantStock(id, stock);
  }
}
