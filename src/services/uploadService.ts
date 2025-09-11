// src/services/uploadService.ts

import axios from "axios";

/**
 * ファイルを分割アップロードするサービス関数
 */
export const uploadService = {
  CHUNK_SIZE: 10 * 1024 * 1024, // 10MBずつチャンク分割
  async uploadFile(file: File, progressCallback: (percent: number) => void) {
    const totalChunks = Math.ceil(file.size / this.CHUNK_SIZE);

    // アップロード開始（uploadIdを取得）
    const startResp = await axios.post("/api/upload/start", {
      fileName: file.name,
    });
    const uploadId = startResp.data.uploadId;

    const parts: { ETag: string; PartNumber: number }[] = [];

    for (let i = 0; i < totalChunks; i++) {
      const start = i * this.CHUNK_SIZE;
      const end = Math.min(file.size, start + this.CHUNK_SIZE);
      const chunk = file.slice(start, end);

      // 署名付きURLの取得
      const presignResp = await axios.post("/api/upload/presign", {
        uploadId,
        chunkIndex: i,
        fileName: file.name,
      });
      const { url, partNumber } = presignResp.data;

      // チャンクをアップロード
      const putResp = await axios.put(url, chunk, {
        headers: { "Content-Type": "application/octet-stream" },
      });

      parts.push({ ETag: putResp.headers.etag, PartNumber: partNumber });

      // 進捗更新（％）
      progressCallback(Math.floor(((i + 1) / totalChunks) * 100));
    }

    // アップロード完了通知
    await axios.post("/api/upload/complete", {
      uploadId,
      fileName: file.name,
      parts,
    });
  },
};
