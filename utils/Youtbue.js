/**
 * Extracts the 11-character YouTube video ID from any common URL format,
 * or from a raw ID if that's what was pasted directly.
 * Returns null if nothing valid could be extracted.
 */
const extractYouTubeId = (input) => {
  if (!input) return null;

  const trimmed = input.trim();

  // already just a raw 11-char video id
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match) return match[1];
  }

  return null;
};

module.exports = { extractYouTubeId };