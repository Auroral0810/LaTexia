import OSS from 'ali-oss';
import { env } from '../../config/env';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

/**
 * 阿里云 OSS 服务类
 */
class OssService {
  private client: OSS;

  constructor() {
    this.client = new OSS({
      accessKeyId: env.OSS_ACCESS_KEY_ID,
      accessKeySecret: env.OSS_ACCESS_KEY_SECRET,
      bucket: env.OSS_BUCKET_NAME,
      endpoint: env.OSS_ENDPOINT,
      secure: true, // 使用 HTTPS
    });
  }

  /**
   * 上传文件
   * @param folder 存储目录 (如 'avatars')
   * @param fileName 原始文件名
   * @param buffer 文件 Buffer
   * @returns 返回上传后的 URL
   */
  async uploadFile(folder: string, fileName: string, buffer: Buffer): Promise<string> {
    const ext = path.extname(fileName);
    const key = `${folder}/${uuidv4()}${ext}`;

    try {
      const result = await this.client.put(key, buffer);
      
      // 如果配置了自定义 OSS_URL，则替换返回的 URL，否则使用 client.put 返回的 url
      if (env.OSS_URL) {
        return `${env.OSS_URL.replace(/\/$/, '')}/${key}`;
      }
      return result.url;
    } catch (err) {
      console.error('[OSS] Upload failed:', err);
      throw new Error('文件上传到 OSS 失败');
    }
  }

  /**
   * 删除文件
   * @param key 文件在 OSS 中的路径
   */
  async deleteFile(key: string): Promise<void> {
    try {
      await this.client.delete(key);
    } catch (err) {
      console.error('[OSS] Delete failed:', err);
    }
  }
}

export const ossService = new OssService();
