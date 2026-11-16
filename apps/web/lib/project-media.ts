/** Match storage URLs / paths that are video files. */
const VIDEO_EXT = /\.(mp4|webm)(?:$|\?)/i;

export function isVideoUrl(url: string): boolean {
  return VIDEO_EXT.test(url);
}
