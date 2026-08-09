import {afterEach, describe, it, expect, vi} from 'vitest';
import {addProductToFamily, publishProductToStorefront, requireAdmin} from './admin';
import {buildVariants, slugifyFamilyName} from '../routes/admin.products.new';

afterEach(() => vi.restoreAllMocks());

// Profit margin calculation utility
function calculateProfitMargin(sellingPrice, baseCost) {
  const selling = parseFloat(sellingPrice) || 0;
  const base = parseFloat(baseCost) || 0;
  if (selling === 0) return '0.0';
  return (((selling - base) / selling) * 100).toFixed(1);
}

// SKU generation utility
function generateVariantSku(designCode, garmentType, color, size) {
  const typeCode = garmentType.replace(/\s+/g, '').slice(0, 3).toUpperCase();
  const colorCode = color.slice(0, 3).toUpperCase();
  return `UNX-${designCode}-${typeCode}-${colorCode}-${size}`;
}

describe('Admin Sizing and Pricing Utilities', () => {
  describe('calculateProfitMargin', () => {
    it('computes correct margin percentage', () => {
      expect(calculateProfitMargin('24.99', '12.99')).toBe('48.0');
      expect(calculateProfitMargin('100', '25')).toBe('75.0');
    });

    it('returns 0.0 for zero selling price', () => {
      expect(calculateProfitMargin('0', '10')).toBe('0.0');
    });
  });

  describe('generateVariantSku', () => {
    it('formats correct internal SKU format', () => {
      expect(generateVariantSku('JGR', 'Hoodie', 'Black', 'M')).toBe('UNX-JGR-HOO-BLA-M');
      expect(generateVariantSku('OTS', 'T-Shirt', 'White', 'XL')).toBe('UNX-OTS-T-S-WHI-XL');
    });
  });

  it('creates size-only variants for a single family color product', () => {
    expect(buildVariants({
      color: 'Midnight Blue', sizes: ['S', 'M'], garmentType: 'T-Shirt',
      designCode: 'OTS', price: '29', weight: '0.3',
    })).toEqual([
      {color: 'Midnight Blue', size: 'S', sku: 'UNX-OTS-T-S-MID-S', price: '29', weight: '0.3'},
      {color: 'Midnight Blue', size: 'M', sku: 'UNX-OTS-T-S-MID-M', price: '29', weight: '0.3'},
    ]);
    expect(slugifyFamilyName('  Classic Tee / Solids  ')).toBe('classic-tee-solids');
  });

  it('keeps created Shopify variants in standard garment-size order', () => {
    expect(buildVariants({
      color: 'Black', sizes: ['XL', 'S', 'L', 'M'], garmentType: 'T-Shirt',
      designCode: 'OTS', price: '29', weight: '0.3',
    }).map(({size}) => size)).toEqual(['S', 'M', 'L', 'XL']);
  });
});

describe('Admin security and Product Family mutations', () => {
  it('expires stale admin sessions', () => {
    const values = new Map([
      ['admin_authenticated', true],
      ['admin_authenticated_at', Date.now() - 2 * 60 * 60 * 1000],
    ]);
    const session = {
      get: vi.fn((key) => values.get(key)),
      unset: vi.fn((key) => values.delete(key)),
    };
    expect(() => requireAdmin({session})).toThrow();
    expect(session.unset).toHaveBeenCalledWith('admin_authenticated');
  });

  it('deduplicates family membership when appending a product', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response(JSON.stringify({data: {metaobject: {
        id: 'gid://shopify/Metaobject/1',
        field: {value: '["gid://shopify/Product/1"]'},
      }}}), {status: 200}))
      .mockResolvedValueOnce(new Response(JSON.stringify({data: {metaobjectUpdate: {
        metaobject: {id: 'gid://shopify/Metaobject/1'}, userErrors: [],
      }}}), {status: 200}));

    await addProductToFamily(
      'gid://shopify/Metaobject/1',
      'gid://shopify/Product/1',
      {PUBLIC_STORE_DOMAIN: 'example.myshopify.com', SHOPIFY_ADMIN_ACCESS_TOKEN: 'token'},
    );
    const updateBody = JSON.parse(globalThis.fetch.mock.calls[1][1].body);
    expect(updateBody.variables.metaobject.fields[0].value).toBe('["gid://shopify/Product/1"]');
  });

  it('refuses to imply publication without a configured publication ID', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    await expect(publishProductToStorefront('gid://shopify/Product/1', {})).rejects.toThrow(
      'SHOPIFY_STOREFRONT_PUBLICATION_ID',
    );
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
