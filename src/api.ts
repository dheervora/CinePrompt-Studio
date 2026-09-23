import { useEffect, useState } from 'react';
import { Health } from './types';

export class ApiError extends Error {
  constructor(public code: string, message: string) {
    super(message);
  }
}

// Posts JSON and surfaces the server's own friendly error message rather than a bare status code.
export async function postJson<T>(url: string, body: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  } catch {
    throw new ApiError('network', "Couldn't reach the CinePrompt server. Check that `npm run dev` is still running.");
  }
  const data = await response.json().catch(() => null);
  if (!response.ok || !data) {
    throw new ApiError(data?.code ?? 'error', data?.error ?? `The server returned an error (${response.status}).`);
  }
  return data as T;
}

const HEALTH_FALLBACK: Health = { hasKey: false, textModel: 'gemini-3.8-flash', fallbackModel: 'gemini-3.7-flash', imageModel: '', imageStatus: 'unknown' };

export function useHealth(): [Health | null, () => void] {
  const [health, setHealth] = useState<Health | null>(null);
  const refresh = () => {
    fetch('/api/health')
      .then((r) => r.json())
      .then(setHealth)
      .catch(() => setHealth(HEALTH_FALLBACK));
  };
  useEffect(refresh, []);
  return [health, refresh];
}

export interface UploadedImage {
  mimeType: string;
  data: string; // base64, no data: prefix
  previewUrl: string;
}

// Reads an image file and downsizes it so uploads stay small.
export function readImageFile(file: File, maxSide = 1280): Promise<UploadedImage> {
  return new Promise((resolve, reject) => {
    if (!/^image\/(png|jpeg|webp)$/.test(file.type)) {
      reject(new Error('Use a PNG, JPEG or WebP image.'));
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
      URL.revokeObjectURL(url);
      resolve({ mimeType: 'image/jpeg', data: dataUrl.split(',')[1], previewUrl: dataUrl });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("That file couldn't be read as an image."));
    };
    img.src = url;
  });
}

export const modelLabel = (id: string) =>
  id.replace(/^gemini-/, 'Gemini ').replace(/-flash/, ' Flash').replace(/-lite/, ' Lite').replace(/-image/, ' Image').replace(/-pro/, ' Pro');
