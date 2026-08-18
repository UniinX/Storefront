import {Form, useActionData, useNavigation, redirect, useLoaderData, Link} from 'react-router';
import {useState} from 'react';
import {
  listDesignMetaobjects,
  listProductFamilies,
  createProductFamily,
  createShopifyDraftProduct,
  requireAdmin,
} from '~/lib/admin';
import {sortSizes} from '~/lib/sizing.js';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{title: 'Create Garment'}];
};

/**
 * Build size variants for one color product. Colors are separate family products.
 * @param {{color: string, sizes: string[], garmentType: string, designCode: string, price: string, weight: string}}
 */
export function buildVariants({color, sizes, garmentType, designCode, price, weight}) {
  const typeCode = garmentType.replace(/\s+/g, '').slice(0, 3).toUpperCase();
  const colorCode = color.replace(/\s+/g, '').slice(0, 3).toUpperCase();
  return sortSizes(sizes).map((size) => ({
    color,
    size,
    sku: `UNX-${designCode}-${typeCode}-${colorCode}-${size}`,
    price,
    weight,
  }));
}

export function slugifyFamilyName(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 64);
}

export async function loader({context}) {
  requireAdmin(context);
  const {env} = context;
  let designs = [];
  let families = [];
  let schemaMissing = false;
  let loadError = null;
  try {
    designs = await listDesignMetaobjects(env);
    families = await listProductFamilies(env);
  } catch (e) {
    console.error('Failed loading designs for product form:', e);
    schemaMissing = true;
    loadError = e instanceof Error ? e.message : String(e);
  }
  return {designs, families, schemaMissing, loadError};
}

/**
 * @param {Route.ActionArgs}
 */
export async function action({request, context}) {
  requireAdmin(context);
  const {env} = context;
  const formData = await request.formData();

  const title = formData.get('title')?.toString();
  const productType = formData.get('productType')?.toString();
  const vendor = formData.get('vendor')?.toString();
  const description = formData.get('description')?.toString();
  const tagsString = formData.get('tags')?.toString() ?? '';
  const designId = formData.get('designId')?.toString();
  const designCode = formData.get('designCode')?.toString();
  const selectedFamilyId = formData.get('familyId')?.toString();
  const newFamilyName = formData.get('newFamilyName')?.toString().trim();
  const familyValue = formData.get('familyValue')?.toString().trim();
  
  // Custom Fit & Sizeguide operational information
  const fit = formData.get('fit')?.toString() ?? 'Regular Fit';
  const material = formData.get('material')?.toString() ?? '100% Combed Cotton';
  const size_guide = formData.get('size_guide')?.toString().trim() ?? '';

  const variantsJson = formData.get('variantsJson')?.toString() ?? '[]';
  let variants;
  try {
    variants = JSON.parse(variantsJson);
  } catch {
    return {error: 'Invalid variant data.'};
  }

  if (!title?.trim() || title.length > 255 || !productType || !designId || !familyValue || !size_guide) {
    return {error: 'Title, garment type, design, family value/color, and a sizing guide are required.'};
  }
  if (!selectedFamilyId && !newFamilyName) {
    return {error: 'Select a Product Family or enter a name for a new family.'};
  }
  if (!Array.isArray(variants) || variants.length === 0) {
    return {error: 'At least one valid product variant is required.'};
  }
  if (variants.some((variant) => !variant.sku || !(Number(variant.price) > 0))) {
    return {error: 'Every variant requires a SKU and a positive price.'};
  }

  const tags = tagsString
    .split(',')
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

  let familyId = selectedFamilyId;
  try {
    if (!familyId && newFamilyName) {
      const slug = slugifyFamilyName(newFamilyName);
      if (!slug) return {error: 'The new Product Family name must contain letters or numbers.'};
      familyId = (await createProductFamily({name: newFamilyName, slug}, env)).id;
    }
  } catch (error) {
    return {error: error instanceof Error ? error.message : String(error)};
  }

  const productData = {
    title,
    productType,
    vendor,
    description,
    tags,
    options: ['Size'],
    variants: variants.map((v) => ({
      price: v.price,
      sku: v.sku,
      weight: v.weight,
      optionValues: [
        {optionName: 'Size', name: v.size},
      ],
    })),
    familyId,
    metafields: {
      design_reference: designId,
      product_family: familyId,
      family_value: familyValue,
      color: familyValue,
      language: formData.get('language')?.toString() || 'English',
      garment_type: productType,
      design_story: description || '',
      fit,
      material,
      size_guide,
      internal_product_code: designCode || 'UNX',
      qikink_status: 'Not Mapped',
      catalog_status: 'Draft',
    },
  };

  try {
    await createShopifyDraftProduct(productData, env);
    return redirect('/admin/products');
  } catch (error) {
    return {error: error instanceof Error ? error.message : String(error)};
  }
}

export default function AdminNewProduct() {
  /** @type {LoaderReturnData} */
  const {designs, families, schemaMissing, loadError} = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  // State for variant generator
  const [productColor, setProductColor] = useState('Black');
  const [selectedSizes, setSelectedSizes] = useState(['S', 'M', 'L']);
  
  const [designId, setDesignId] = useState('');
  const [designCode, setDesignCode] = useState('UNX');
  const [designLanguage, setDesignLanguage] = useState('English');
  const [garmentType, setGarmentType] = useState('T-Shirt');

  const [baseCost, setBaseCost] = useState('12.99');
  const [sellingPrice, setSellingPrice] = useState('24.99');
  const [weight, setWeight] = useState('0.3');

  // Compute profit margin
  const sellingPriceNum = parseFloat(sellingPrice) || 0;
  const baseCostNum = parseFloat(baseCost) || 0;
  const marginPercent = sellingPriceNum > 0 ? (((sellingPriceNum - baseCostNum) / sellingPriceNum) * 100).toFixed(1) : '0.0';

  // Toggle selection lists
  const handleSizeToggle = (size) => {
    setSelectedSizes((prev) =>
      sortSizes(
        prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
      ),
    );
  };

  // Cartesian product of the selected colors/sizes, recomputed each render.
  const generatedVariants = buildVariants({
    color: productColor,
    sizes: selectedSizes,
    garmentType,
    designCode,
    price: sellingPrice,
    weight,
  });

  const handleDesignChange = (e) => {
    const id = e.target.value;
    setDesignId(id);
    const chosen = designs.find((d) => d.id === id);
    if (chosen) {
      setDesignCode(chosen.internal_code || 'UNX');
      setDesignLanguage(chosen.language || 'English');
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in text-black dark:text-white">
      {/* Header */}
      <div>
        <Link
          to="/admin/products"
          className="font-work text-[9px] tracking-wider uppercase text-black/50 hover:text-black dark:text-white/40 dark:hover:text-white mb-4 inline-flex items-center gap-1 transition-all"
        >
          ← Back to catalog
        </Link>
        <h3 className="font-marcellus text-2xl uppercase">
          Create Garment Product
        </h3>
        <p className="font-work text-xs text-black/50 dark:text-white/40 mt-1">
          Configure sizing configurations, pricing tables, and publish to Shopify drafts.
        </p>
      </div>

      <div className="w-full h-[1px] bg-black/10 dark:bg-white/10" />

      {schemaMissing && (
        <div className="p-6 rounded-2xl border border-yellow-500/25 bg-yellow-500/5 text-yellow-800 dark:text-yellow-400 font-work text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="font-semibold uppercase tracking-wider block mb-1">
              ⚠️ Design Schema Missing
            </span>
            <p>{loadError || 'You cannot create a garment product until the Shopify schema is initialized.'}</p>
          </div>
          <Link
            to="/admin/setup"
            className="px-5 py-2.5 rounded-xl bg-black dark:bg-white text-white dark:text-black font-semibold text-[9px] tracking-wider uppercase whitespace-nowrap shadow-sm hover:opacity-90"
          >
            Run Setup Utility
          </Link>
        </div>
      )}

      {/* Form */}
      <Form method="POST" className="flex flex-col gap-6">
        <fieldset disabled={schemaMissing} className="disabled:opacity-60 border-none p-0 m-0 flex flex-col gap-6">
        
        {/* Hidden inputs */}
        <input type="hidden" name="designCode" value={designCode} />
        <input type="hidden" name="language" value={designLanguage} />
        <input type="hidden" name="variantsJson" value={JSON.stringify(generatedVariants)} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Left: General Product Parameters */}
          <div className="flex flex-col gap-5 border border-black/5 dark:border-white/5 rounded-2xl p-6 bg-black/[0.005] dark:bg-white/[0.005]">
            <h4 className="font-marcellus text-xs uppercase tracking-wider text-black/40 dark:text-white/40 mb-2">
              General Parameters
            </h4>

            {/* Product Title */}
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="product-title" className="font-work text-[9px] tracking-wider text-black/45 dark:text-white/30 uppercase">
                Product Title
              </label>
              <input
                id="product-title"
                type="text"
                name="title"
                required
                placeholder="e.g. Uniinx Premium Jigar Hoodie"
                className="w-full px-4 py-3 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-black dark:text-white text-sm font-work font-light focus:outline-none focus:border-brand-accent dark:focus:border-brand-accent-light transition-all"
              />
            </div>

            {/* Select Design */}
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="product-design" className="font-work text-[9px] tracking-wider text-black/45 dark:text-white/30 uppercase">
                Associate Design Mockup
              </label>
              <select
                id="product-design"
                name="designId"
                required
                value={designId}
                onChange={handleDesignChange}
                className="w-full px-4 py-3 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-black dark:text-white text-sm font-work font-light focus:outline-none focus:border-brand-accent dark:focus:border-brand-accent-light transition-all"
              >
                <option value="">Select design...</option>
                {designs.map((design) => (
                  <option key={design.id} value={design.id}>
                    {design.name} ({design.internal_code})
                  </option>
                ))}
              </select>
              <p className="font-work text-[9px] text-black/45 dark:text-white/40">Language: {designLanguage}</p>
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="product-family" className="font-work text-[9px] tracking-wider text-black/45 dark:text-white/30 uppercase">
                Product Family
              </label>
              <select id="product-family" name="familyId" className="w-full px-4 py-3 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-sm font-work">
                <option value="">Create a new family below…</option>
                {families.map((family) => <option key={family.id} value={family.id}>{family.name || family.handle}</option>)}
              </select>
              <input name="newFamilyName" type="text" placeholder="New family name (when none selected)" className="w-full mt-2 px-4 py-3 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-sm font-work" />
              <p className="font-work text-[9px] text-black/45 dark:text-white/40">A family groups separate color products on the storefront.</p>
            </div>

            {/* Garment Type */}
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="product-type" className="font-work text-[9px] tracking-wider text-black/45 dark:text-white/30 uppercase">
                Garment Type
              </label>
              <select
                id="product-type"
                name="productType"
                required
                value={garmentType}
                onChange={(e) => setGarmentType(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-black dark:text-white text-sm font-work font-light focus:outline-none focus:border-brand-accent dark:focus:border-brand-accent-light transition-all"
              >
                <option value="T-Shirt">T-Shirt</option>
                <option value="Hoodie">Hoodie</option>
                <option value="Sweatshirt">Sweatshirt</option>
              </select>
            </div>

            {/* Fit & Material */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="product-fit" className="font-work text-[9px] tracking-wider text-black/45 dark:text-white/30 uppercase">
                  Garment Fit
                </label>
                <input
                  id="product-fit"
                  type="text"
                  name="fit"
                  defaultValue="Regular Fit"
                  placeholder="Regular Fit"
                  className="w-full px-4 py-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-black dark:text-white text-xs font-work font-light focus:outline-none focus:border-brand-accent dark:focus:border-brand-accent-light"
                />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="product-material" className="font-work text-[9px] tracking-wider text-black/45 dark:text-white/30 uppercase">
                  Material
                </label>
                <input
                  id="product-material"
                  type="text"
                  name="material"
                  defaultValue="100% Cotton"
                  placeholder="100% Cotton"
                  className="w-full px-4 py-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-black dark:text-white text-xs font-work font-light focus:outline-none focus:border-brand-accent dark:focus:border-brand-accent-light"
                />
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="product-description" className="font-work text-[9px] tracking-wider text-black/45 dark:text-white/30 uppercase">
                Product Description
              </label>
              <textarea
                id="product-description"
                name="description"
                required
                rows={3}
                placeholder="Product content descriptions..."
                className="w-full px-4 py-3 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-black dark:text-white text-sm font-work font-light focus:outline-none focus:border-brand-accent dark:focus:border-brand-accent-light transition-all resize-none"
              />
            </div>
          </div>

          {/* Right: Sizing & Pricing Tables */}
          <div className="flex flex-col gap-5 border border-black/5 dark:border-white/5 rounded-2xl p-6 bg-black/[0.005] dark:bg-white/[0.005]">
            <h4 className="font-marcellus text-xs uppercase tracking-wider text-black/40 dark:text-white/40 mb-2">
              Sizing & Pricing
            </h4>

            {/* Family value / color */}
            <div className="flex flex-col gap-2">
              <label htmlFor="family-value" className="font-work text-[9px] tracking-wider text-black/45 dark:text-white/30 uppercase block">Family Value / Product Color</label>
              <input id="family-value" name="familyValue" required value={productColor} onChange={(event) => setProductColor(event.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-xs font-work" />
              <p className="font-work text-[9px] text-black/45 dark:text-white/40">Create another Shopify product for each color and assign it to this same family.</p>
            </div>

            {/* Garment Sizes */}
            <div className="flex flex-col gap-2">
              <span className="font-work text-[9px] tracking-wider text-black/45 dark:text-white/30 uppercase block">
                Garment Sizes
              </span>
              <div className="flex flex-wrap gap-4">
                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                  <label key={size} className="flex items-center gap-2 font-work text-xs text-black/75 dark:text-white/70 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedSizes.includes(size)}
                      onChange={() => handleSizeToggle(size)}
                      className="rounded border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-brand-accent focus:ring-brand-accent"
                    />
                    {size}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="product-size-guide" className="font-work text-[9px] tracking-wider text-black/45 dark:text-white/30 uppercase">
                Size Guide
              </label>
              <textarea
                id="product-size-guide"
                name="size_guide"
                required
                rows={6}
                placeholder={'Size | Chest | Length (in)\nS | 38 | 27\nM | 40 | 28\nL | 43 | 29\nXL | 46 | 30'}
                className="w-full px-4 py-3 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-black dark:text-white text-xs font-mono leading-relaxed focus:outline-none focus:border-brand-accent dark:focus:border-brand-accent-light transition-all resize-y"
              />
              <p className="font-work text-[9px] text-black/45 dark:text-white/40">
                Enter one size per line. Keep the header and measurement columns in the order customers should read them.
              </p>
            </div>

            {/* Costs inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="product-base" className="font-work text-[9px] tracking-wider text-black/45 dark:text-white/30 uppercase">
                  Base Cost ($)
                </label>
                <input
                  id="product-base"
                  type="number"
                  step="0.01"
                  value={baseCost}
                  onChange={(e) => setBaseCost(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-black dark:text-white text-xs font-work focus:outline-none focus:border-brand-accent"
                />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="product-selling" className="font-work text-[9px] tracking-wider text-black/45 dark:text-white/30 uppercase">
                  Selling Price ($)
                </label>
                <input
                  id="product-selling"
                  type="number"
                  step="0.01"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-black dark:text-white text-xs font-work focus:outline-none focus:border-brand-accent"
                />
              </div>
            </div>

            {/* Margins Banner */}
            <div className="flex items-center justify-between p-4 bg-brand-accent/5 dark:bg-brand-accent-light/5 border border-brand-accent/15 rounded-xl font-work text-xs">
              <span className="text-black/50 dark:text-white/50">Calculated Profit Margin:</span>
              <span className="font-semibold text-brand-accent dark:text-brand-accent-light">{marginPercent}%</span>
            </div>
          </div>

        </div>

        {/* Dynamic Variant Previewer Table */}
        <div className="flex flex-col gap-4">
          <h4 className="font-work text-xs tracking-wider uppercase text-black/50 dark:text-white/40">
            Generated Shopify Variants ({generatedVariants.length})
          </h4>
          
          <div className="border border-black/5 dark:border-white/5 rounded-2xl overflow-hidden bg-black/[0.005] dark:bg-white/[0.005] max-h-80 overflow-y-auto">
            <table className="w-full text-left border-collapse font-work text-xs">
              <thead>
                <tr className="bg-black/[0.02] dark:bg-white/[0.02] border-b border-black/5 dark:border-white/5 text-[9px] uppercase tracking-wider text-black/40 dark:text-white/30">
                  <th className="p-4 font-semibold">Variant Options</th>
                  <th className="p-4 font-semibold">Generated SKU</th>
                  <th className="p-4 font-semibold">Price</th>
                  <th className="p-4 font-semibold">Weight</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5">
                {generatedVariants.map((v) => (
                  <tr key={v.sku} className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01]">
                    <td className="p-4 font-medium">{v.size}</td>
                    <td className="p-4 font-mono text-[10px]">{v.sku}</td>
                    <td className="p-4">${v.price}</td>
                    <td className="p-4">{v.weight} kg</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action errors */}
        {actionData?.error && (
          <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-400 font-work text-xs font-light">
            {actionData.error}
          </div>
        )}

        {/* Submit action */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-4 rounded-full bg-brand-accent dark:bg-brand-accent-light text-brand-bg-light dark:text-brand-bg-dark font-work text-[10px] tracking-wider uppercase font-semibold hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer shadow-md disabled:opacity-50"
          >
            {isSubmitting ? 'Creating Draft Product...' : 'Create Draft Product'}
          </button>
          <Link
            to="/admin/products"
            className="px-6 py-4 rounded-full border border-black/10 dark:border-white/10 font-work text-[10px] tracking-wider uppercase font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-all text-black/60 dark:text-white/60"
          >
            Cancel
          </Link>
        </div>

        </fieldset>
      </Form>
    </div>
  );
}

/** @typedef {import('./+types/admin.products.new').Route} Route */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
