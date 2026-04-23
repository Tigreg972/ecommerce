export function buildMediaUrl(
  rawUrl: string | null | undefined,
  apiBaseUrl: string,
): string | null {
  if (!rawUrl) {
    return null;
  }

  const trimmedUrl = rawUrl.trim();

  if (!trimmedUrl) {
    return null;
  }

  // URL externe déjà complète
  if (/^https?:\/\//i.test(trimmedUrl)) {
    return trimmedUrl;
  }

  // Cas : /uploads/image.jpg
  if (trimmedUrl.startsWith('/uploads/')) {
    return `${apiBaseUrl}${trimmedUrl}`;
  }

  // Cas : uploads/image.jpg
  if (trimmedUrl.startsWith('uploads/')) {
    return `${apiBaseUrl}/${trimmedUrl}`;
  }

  // Cas : image.jpg
  return `${apiBaseUrl}/uploads/${trimmedUrl}`;
}