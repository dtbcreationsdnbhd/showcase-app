/** Accepted showcase media for main + detail uploads. */
export const PROJECT_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const PROJECT_VIDEO_TYPES = ["video/mp4", "video/webm"] as const;

export const PROJECT_MEDIA_ACCEPT = [
  ...PROJECT_IMAGE_TYPES,
  ...PROJECT_VIDEO_TYPES,
] as const;

/** Matches Supabase Free global upload cap. */
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 50 * 1024 * 1024;
/**
 * Main + detail files in one Server Action must stay under the proxy buffer.
 * Keep a little under next.config proxyClientMaxBodySize.
 */
export const MAX_UPLOAD_TOTAL_BYTES = 100 * 1024 * 1024;

const VIDEO_EXT = /\.(mp4|webm)(?:$|\?)/i;

export function isVideoUrl(url: string): boolean {
  return VIDEO_EXT.test(url);
}

export function isProjectImageType(type: string): boolean {
  return (PROJECT_IMAGE_TYPES as readonly string[]).includes(type);
}

export function isProjectVideoType(type: string): boolean {
  return (PROJECT_VIDEO_TYPES as readonly string[]).includes(type);
}

export function mediaFileError(file: File): string | null {
  const image = isProjectImageType(file.type);
  const video = isProjectVideoType(file.type);
  if (!image && !video) {
    return "Files must be JPG, PNG, WebP, MP4, or WebM.";
  }
  if (image && file.size > MAX_IMAGE_BYTES) {
    return "Each image must be 5 MB or smaller.";
  }
  if (video && file.size > MAX_VIDEO_BYTES) {
    return "Each video must be 50 MB or smaller.";
  }
  return null;
}

export function totalUploadBytes(files: readonly File[]): number {
  return files.reduce((sum, file) => sum + file.size, 0);
}
