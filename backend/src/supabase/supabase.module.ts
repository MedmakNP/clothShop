import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { SupabaseService } from './supabase.service';
import { SupabaseUploadController } from './supabase.upload.controller';

@Module({
  imports: [
    MulterModule.register({
      storage: memoryStorage(), // щоб мати file.buffer
      limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
      fileFilter: (_req, file, cb) => {
        if (/^image\/(png|jpe?g|webp|gif|svg\+xml)$/.test(file.mimetype))
          cb(null, true);
        else cb(new Error('Only image files are allowed'), false);
      },
    }),
  ],
  providers: [SupabaseService],
  controllers: [SupabaseUploadController],
  exports: [SupabaseService],
})
export class SupabaseModule {}
