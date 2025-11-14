/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import type { Express } from 'express';

export type UploadOptions = {
  folder?: string; // наприклад 'products' або 'banners'
  filename?: string; // кастомне ім'я (без шляху)
  upsert?: boolean; // дозволяти перезапис
};

@Injectable()
export class SupabaseService {
  private client: SupabaseClient;
  private bucket: string;

  constructor() {
    const url = process.env.SUPABASE_URL!;
    const key = process.env.SUPABASE_KEY!;
    this.bucket = process.env.SUPABASE_BUCKET || 'products';
    if (!url || !key) throw new Error('Supabase env vars are missing');
    this.client = createClient(url, key);
  }

  async uploadImage(file: Express.Multer.File, opts: UploadOptions = {}) {
    if (!file) throw new Error('No file');
    const ext = (file.originalname.split('.').pop() || 'jpg').toLowerCase();

    if (!/^image\/(png|jpe?g|webp|gif|svg\+xml)$/.test(file.mimetype)) {
      throw new Error('Unsupported mime type');
    }

    const name = opts.filename || `${randomUUID()}.${ext}`;
    const folder = (opts.folder || 'products').replace(/^\/|\/$/g, '');
    const path = `${folder}/${name}`;

    const { error } = await this.client.storage
      .from(this.bucket)
      .upload(path, file.buffer, {
        contentType: file.mimetype,
        upsert: !!opts.upsert,
      });

    if (error) throw error;

    const { data } = this.client.storage.from(this.bucket).getPublicUrl(path);
    return { url: data.publicUrl, path };
  }

  /** Видалити файл за шляхом у бакеті (те, що повертаємо як `path`) */
  async remove(path: string) {
    const { error } = await this.client.storage
      .from(this.bucket)
      .remove([path]);
    if (error) throw error;
    return { ok: true };
  }
}
