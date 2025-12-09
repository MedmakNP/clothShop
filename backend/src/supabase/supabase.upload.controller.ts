/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  Delete,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { SupabaseService } from './supabase.service';
import type { Express } from 'express';

@Controller('upload')
export class SupabaseUploadController {
  constructor(private readonly supabase: SupabaseService) {}

  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder?: string,
  ) {
    if (!file) {
      throw new BadRequestException('Файл не передано (field name: "file")');
    }

    try {
      const res = await this.supabase.uploadImage(file, { folder });
      return res; // { url, path }
    } catch (err: any) {
      console.error('Supabase upload error:', err);

      // Витягнути якнайбільше інфи
      const message =
        typeof err === 'string'
          ? err
          : err?.message || err?.error?.message || JSON.stringify(err);

      throw new InternalServerErrorException(message);
    }
  }

  @Delete('image')
  async remove(@Body('path') path: string) {
    return this.supabase.remove(path);
  }
}
