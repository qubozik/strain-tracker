import sharp from 'sharp';

const MAX_DIM = 1200;
const JPEG_QUALITY = 80;
const MAX_BYTES = 20 * 1024 * 1024; // don't download anything larger than 20MB

/**
 * Persist a list of image references so they are self-contained.
 * - data: URLs (uploads already resized in the browser) are kept as-is.
 * - http(s) URLs are downloaded, resized, and converted to a JPEG data URL so
 *   the image survives even if the source URL later disappears.
 * If a remote fetch fails, the original URL is kept as a graceful fallback.
 */
export async function persistImages(images: string[]): Promise<string[]> {
  const input = (images ?? []).filter(Boolean).slice(0, 3);
  const out: string[] = [];

  for (const entry of input) {
    if (entry.startsWith('data:')) {
      // Already an embedded (uploaded) image.
      out.push(entry);
      continue;
    }
    if (/^https?:\/\//i.test(entry)) {
      try {
        const dataUrl = await downloadAndResize(entry);
        out.push(dataUrl);
      } catch (err) {
        console.error('Failed to persist image URL, keeping reference:', entry, err);
        out.push(entry); // fallback: keep the link so nothing is lost
      }
      continue;
    }
    // Unknown format — keep as-is.
    out.push(entry);
  }

  return out;
}

async function downloadAndResize(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (compatible; StrainTracker/1.0; +https://vercel.com)',
      Accept: 'image/*',
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} fetching image`);
  }

  const contentType = res.headers.get('content-type') ?? '';
  if (!contentType.startsWith('image/')) {
    throw new Error(`Not an image (content-type: ${contentType || 'unknown'})`);
  }

  const contentLength = Number(res.headers.get('content-length') ?? 0);
  if (contentLength && contentLength > MAX_BYTES) {
    throw new Error('Image too large');
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  if (buffer.byteLength > MAX_BYTES) {
    throw new Error('Image too large');
  }

  const resized = await sharp(buffer)
    .rotate() // respect EXIF orientation
    .resize(MAX_DIM, MAX_DIM, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: JPEG_QUALITY })
    .toBuffer();

  return `data:image/jpeg;base64,${resized.toString('base64')}`;
}