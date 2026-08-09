import { describe, expect, it } from 'vitest';
import { resolveAssetPath } from './assetPaths';

describe('resolveAssetPath', () => {
  it('keeps root-relative paths for local development', () => {
    expect(resolveAssetPath('/logo.png', '/')).toBe('/logo.png');
  });

  it('prefixes the configured base path for GitHub Pages deployments', () => {
    expect(resolveAssetPath('logo.png', '/LX-SHOT/')).toBe('/LX-SHOT/logo.png');
  });

  it('handles nested public assets correctly', () => {
    expect(resolveAssetPath('/products/coffee.svg', '/LX-SHOT/')).toBe('/LX-SHOT/products/coffee.svg');
  });
});
