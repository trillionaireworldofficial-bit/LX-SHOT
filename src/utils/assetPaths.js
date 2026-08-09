export function resolveAssetPath(path, base = import.meta.env.BASE_URL || '/') {
  if (!path) {
    return path;
  }

  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }

  const normalizedBase = base === '/' ? '/' : base.replace(/\/$/, '/');
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;

  if (normalizedBase === '/') {
    return `/${normalizedPath}`;
  }

  return `${normalizedBase}${normalizedPath}`;
}
