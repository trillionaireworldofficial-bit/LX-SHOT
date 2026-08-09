import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { products } from './products';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('product assets', () => {
  it('includes a premium hero visual asset', () => {
    const heroPath = path.resolve(__dirname, '../../public/hero-visual.webp');
    expect(fs.existsSync(heroPath), 'The premium hero visual asset should exist').toBe(true);
  });

  it('references files that exist in the public product asset folder', () => {
    for (const product of products) {
      const assetPath = product.image.replace(/^\/+/, '');
      const fullPath = path.resolve(__dirname, '../../public', assetPath);

      expect(fs.existsSync(fullPath), `${product.name} should have a built asset at ${product.image}`).toBe(true);
    }
  });
});
