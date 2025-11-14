import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SupabaseService } from './supabase.service';
import type { Express } from 'express';

@Controller('upload')
export class SupabaseUploadController {
  constructor(private readonly supabase: SupabaseService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder?: string,
  ) {
    const res = await this.supabase.uploadImage(file, { folder });
    return res; // { url, path }
  }

  @Delete('image')
  async remove(@Body('path') path: string) {
    return this.supabase.remove(path);
  }
}
