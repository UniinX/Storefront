/**
 * @file Helper client for the Shopify Admin GraphQL API.
 */

import {redirect} from 'react-router';

export const PRODUCT_FAMILY_TYPE = 'product_family';
export const ADMIN_SESSION_TTL_MS = 60 * 60 * 1000;

export const PRODUCT_METAFIELD_DEFINITIONS = [
  ['Product Family', 'product_family', 'metaobject_reference', 'family'],
  ['Family Value', 'family_value', 'single_line_text_field'],
  ['Color', 'color', 'single_line_text_field'],
  ['Design', 'design_reference', 'metaobject_reference', 'design'],
  ['Language', 'language', 'single_line_text_field'],
  ['Garment Type', 'garment_type', 'single_line_text_field'],
  ['Design Story', 'design_story', 'multi_line_text_field'],
  ['Fit', 'fit', 'single_line_text_field'],
  ['Material', 'material', 'single_line_text_field'],
  ['Size Guide', 'size_guide', 'multi_line_text_field'],
  ['Internal Product Code', 'internal_product_code', 'single_line_text_field'],
  ['Qikink Status', 'qikink_status', 'single_line_text_field'],
  ['Catalog Status', 'catalog_status', 'single_line_text_field'],
];

export function requireAdmin(context) {
  const authenticatedAt = Number(context.session.get('admin_authenticated_at'));
  const isExpired = !authenticatedAt || Date.now() - authenticatedAt > ADMIN_SESSION_TTL_MS;
  if (!context.session.get('admin_authenticated') || isExpired) {
    context.session.unset('admin_authenticated');
    context.session.unset('admin_authenticated_at');
    throw redirect('/admin/login');
  }
}

/**
 * Execute a query or mutation on the Shopify Admin GraphQL API.
 * @param {string} query
 * @param {Record<string, any>} variables
 * @param {Record<string, any>} env
 * @returns {Promise<any>}
 */
export async function adminQuery(query, variables = {}, env) {
  const shopDomain = env.PUBLIC_STORE_DOMAIN;
  const accessToken = env.SHOPIFY_ADMIN_ACCESS_TOKEN;

  if (!shopDomain) {
    throw new Error('PUBLIC_STORE_DOMAIN is not set in environment.');
  }
  if (!accessToken) {
    throw new Error('Admin API Access Token is not set in environment.');
  }

  const url = `https://${shopDomain}/admin/api/2026-04/graphql.json`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken,
      },
      body: JSON.stringify({query, variables}),
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Admin API request timed out after 15 seconds.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Admin API request failed with status ${response.status}: ${errorText}`);
  }

  const payload = await response.json();
  if (payload?.errors?.length) {
    throw new Error(
      `Admin API request failed: ${payload.errors.map(({message}) => message).join('; ')}`,
    );
  }
  return payload;
}

export async function adminQueryAll(query, variables, env, getConnection) {
  const nodes = [];
  let after;
  let hasNextPage = true;
  while (hasNextPage) {
    const response = await adminQuery(query, {...variables, after}, env);
    const connection = getConnection(response);
    nodes.push(...(connection?.nodes ?? []));
    hasNextPage = Boolean(connection?.pageInfo?.hasNextPage);
    after = connection?.pageInfo?.endCursor;
  }
  return nodes;
}

/**
 * Ensures the `uniinx_design` metaobject definition exists in Shopify.
 * @param {Record<string, any>} env
 * @returns {Promise<string>}
 */
export async function getOrCreateDesignMetaobjectDefinition(env) {
  const designFields = [
    {name: 'Design Name', key: 'name', type: 'single_line_text_field'},
    {name: 'Language', key: 'language', type: 'single_line_text_field'},
    {name: 'Story', key: 'story', type: 'multi_line_text_field'},
    {name: 'Short Description', key: 'short_description', type: 'multi_line_text_field'},
    {name: 'Designer Name', key: 'designer', type: 'single_line_text_field'},
    {name: 'Artwork Image URL', key: 'artwork_url', type: 'single_line_text_field'},
    {name: 'Internal Design Code', key: 'internal_code', type: 'single_line_text_field'},
    {name: 'Status', key: 'status', type: 'single_line_text_field'},
  ];
  const checkQuery = `/* GraphQL */
    query GetMetaobjectDefinition($type: String!) {
      metaobjectDefinitionByType(type: $type) {
        id
        type
        access { storefront }
        fieldDefinitions { key type { name } }
      }
    }
  `;

  const res = await adminQuery(checkQuery, {type: 'uniinx_design'}, env);
  if (res?.data?.metaobjectDefinitionByType) {
    const verified = verifyMetaobjectDefinition(res.data.metaobjectDefinitionByType, designFields);
    if (!verified.valid) {
      throw new Error(`Uniinx Design definition is incompatible: ${verified.mismatches.join('; ')}.`);
    }
    return verified.id;
  }

  // Create definition if not found
  const createMutation = `/* GraphQL */
    mutation CreateDesignDefinition($definition: MetaobjectDefinitionCreateInput!) {
      metaobjectDefinitionCreate(definition: $definition) {
        metaobjectDefinition {
          id
          type
          name
        }
        userErrors {
          field
          message
          code
        }
      }
    }
  `;

  const definitionInput = {
    name: 'Uniinx Design',
    type: 'uniinx_design',
    access: {storefront: 'PUBLIC_READ'},
    fieldDefinitions: designFields,
  };

  const createRes = await adminQuery(createMutation, {definition: definitionInput}, env);
  const payload = createRes?.data?.metaobjectDefinitionCreate;
  const definition = payload?.metaobjectDefinition;
  const userErrors = payload?.userErrors ?? [];

  if (userErrors.length > 0) {
    throw new Error(
      `Unable to create design definition: ${userErrors
        .map(({field, message, code}) =>
          `${field?.join('.') || 'definition'}: ${message}${code ? ` (${code})` : ''}`,
        )
        .join('; ')}`,
    );
  }

  if (!definition?.id) {
    throw new Error(
      `Metaobject definition creation returned no ID. Response: ${JSON.stringify(
        createRes?.data || createRes,
      )}`,
    );
  }

  return definition.id;
}

const METAOBJECT_DEFINITION_QUERY = `/* GraphQL */
  query GetMetaobjectDefinition($type: String!) {
    metaobjectDefinitionByType(type: $type) {
      id
      type
      access { storefront }
      fieldDefinitions { key type { name } }
    }
  }
`;

const FAMILY_FIELDS = [
  {name: 'Name', key: 'name', type: 'single_line_text_field', required: true},
  {name: 'Slug', key: 'slug', type: 'single_line_text_field', required: true},
  {name: 'Products', key: 'products', type: 'list.product_reference'},
];

/** Create Product Family when absent and verify existing definitions without overwriting merchant data. */
export async function getOrCreateProductFamilyDefinition(env) {
  const existing = await adminQuery(METAOBJECT_DEFINITION_QUERY, {type: PRODUCT_FAMILY_TYPE}, env);
  const definition = existing?.data?.metaobjectDefinitionByType;
  if (definition) return verifyMetaobjectDefinition(definition, FAMILY_FIELDS);

  const response = await adminQuery(
    `/* GraphQL */
      mutation CreateProductFamilyDefinition($definition: MetaobjectDefinitionCreateInput!) {
        metaobjectDefinitionCreate(definition: $definition) {
          metaobjectDefinition { id type access { storefront } fieldDefinitions { key type { name } } }
          userErrors { field message code }
        }
      }
    `,
    {definition: {
      name: 'Product Family',
      type: PRODUCT_FAMILY_TYPE,
      access: {storefront: 'PUBLIC_READ'},
      fieldDefinitions: FAMILY_FIELDS,
    }},
    env,
  );
  throwOnUserErrors(response?.data?.metaobjectDefinitionCreate, 'Product Family definition creation failed');
  return verifyMetaobjectDefinition(
    response?.data?.metaobjectDefinitionCreate?.metaobjectDefinition,
    FAMILY_FIELDS,
  );
}

function verifyMetaobjectDefinition(definition, expectedFields) {
  if (!definition?.id) throw new Error('Metaobject definition verification returned no ID.');
  const actual = new Map((definition.fieldDefinitions ?? []).map((field) => [field.key, field.type?.name]));
  const mismatches = expectedFields.flatMap((field) => {
    const actualType = actual.get(field.key);
    if (!actualType) return [`missing ${field.key} (${field.type})`];
    return actualType === field.type ? [] : [`${field.key} is ${actualType}, expected ${field.type}`];
  });
  if (definition.access?.storefront !== 'PUBLIC_READ') mismatches.push('Storefront access is not PUBLIC_READ');
  return {id: definition.id, valid: mismatches.length === 0, mismatches};
}

/** Create missing Product metafield definitions and report incompatible existing definitions. */
export async function ensureProductMetafieldDefinitions(env, definitionIds = {}) {
  const response = await adminQuery(
    `/* GraphQL */
      query ProductMetafieldDefinitions($after: String) {
        metafieldDefinitions(ownerType: PRODUCT, first: 100, after: $after, query: "namespace:custom") {
          nodes { id namespace key type { name } access { storefront } }
          pageInfo { hasNextPage endCursor }
        }
      }
    `,
    {},
    env,
  );
  const existing = new Map(
    (response?.data?.metafieldDefinitions?.nodes ?? []).map((definition) => [definition.key, definition]),
  );
  const created = [];
  const mismatches = [];

  for (const [name, key, type, validationDefinition] of PRODUCT_METAFIELD_DEFINITIONS) {
    const definition = existing.get(key);
    if (definition) {
      if (definition.type?.name !== type) mismatches.push(`${key} is ${definition.type?.name}, expected ${type}`);
      if (definition.access?.storefront !== 'PUBLIC_READ') mismatches.push(`${key} is not Storefront-readable`);
      continue;
    }
    const create = await adminQuery(
      `/* GraphQL */
        mutation CreateProductMetafieldDefinition($definition: MetafieldDefinitionInput!) {
          metafieldDefinitionCreate(definition: $definition) {
            createdDefinition { id key }
            userErrors { field message code }
          }
        }
      `,
      {definition: {
        name,
        namespace: 'custom',
        key,
        type,
        ownerType: 'PRODUCT',
        access: {storefront: 'PUBLIC_READ'},
        ...(validationDefinition && definitionIds[validationDefinition]
          ? {validations: [{name: 'metaobject_definition_id', value: definitionIds[validationDefinition]}]}
          : {}),
      }},
      env,
    );
    throwOnUserErrors(create?.data?.metafieldDefinitionCreate, `Unable to create custom.${key}`);
    created.push(key);
  }
  return {created, mismatches, valid: mismatches.length === 0};
}

export async function initializeAdminSchema(env) {
  const designDefinitionId = await getOrCreateDesignMetaobjectDefinition(env);
  const family = await getOrCreateProductFamilyDefinition(env);
  const productMetafields = await ensureProductMetafieldDefinitions(env, {
    design: designDefinitionId,
    family: family.id,
  });
  return {designDefinitionId, family, productMetafields};
}

function throwOnUserErrors(payload, prefix) {
  const errors = payload?.userErrors ?? [];
  if (errors.length) {
    throw new Error(`${prefix}: ${errors.map(({message}) => message).join('; ')}`);
  }
}

/**
 * Check currently granted API scopes.
 * @param {Record<string, any>} env
 * @returns {Promise<string[]>}
 */
export async function checkAccessScopes(env) {
  const query = `/* GraphQL */
    query CurrentScopes {
      currentAppInstallation {
        accessScopes {
          handle
        }
      }
    }
  `;
  const res = await adminQuery(query, {}, env);
  const scopes = res?.data?.currentAppInstallation?.accessScopes ?? [];
  return scopes.map((s) => s.handle);
}

/**
 * Commits a design metaobject instance to Shopify.
 * @param {Record<string, string>} design
 * @param {Record<string, any>} env
 * @returns {Promise<any>}
 */
export async function createDesignMetaobject(design, env) {
  // Ensure definition exists
  await getOrCreateDesignMetaobjectDefinition(env);

  const createMutation = `/* GraphQL */
    mutation CreateMetaobject($metaobject: MetaobjectCreateInput!) {
      metaobjectCreate(metaobject: $metaobject) {
        metaobject {
          id
          handle
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const fields = Object.entries(design).map(([key, value]) => ({
    key,
    value: value || '',
  }));

  const res = await adminQuery(
    createMutation,
    {
      metaobject: {
        type: 'uniinx_design',
        fields,
      },
    },
    env,
  );

  const errors = res?.data?.metaobjectCreate?.userErrors;
  if (errors?.length) {
    throw new Error(errors[0].message);
  }

  return res?.data?.metaobjectCreate?.metaobject;
}

/**
 * Query all active design metaobjects.
 * @param {Record<string, any>} env
 * @returns {Promise<Array<any>>}
 */
export async function listDesignMetaobjects(env) {
  const query = `/* GraphQL */
    query ListDesigns($type: String!, $after: String) {
      metaobjects(type: $type, first: 100, after: $after) {
        nodes {
          id
          handle
          fields {
            key
            value
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;

  const nodes = [];
  let after;
  let hasNextPage = true;
  while (hasNextPage) {
    const res = await adminQuery(query, {type: 'uniinx_design', after}, env);
    const connection = res?.data?.metaobjects;
    nodes.push(...(connection?.nodes ?? []));
    hasNextPage = Boolean(connection?.pageInfo?.hasNextPage);
    after = connection?.pageInfo?.endCursor;
  }

  return nodes.map((node) => {
    const fields = {};
    for (const f of node.fields) {
      fields[f.key] = f.value;
    }
    return {
      id: node.id,
      handle: node.handle,
      ...fields,
    };
  });
}

export async function listProductFamilies(env) {
  const nodes = await adminQueryAll(
    `/* GraphQL */
      query ListProductFamilies($type: String!, $after: String) {
        metaobjects(type: $type, first: 100, after: $after) {
          nodes { id handle fields { key value } }
          pageInfo { hasNextPage endCursor }
        }
      }
    `,
    {type: PRODUCT_FAMILY_TYPE},
    env,
    (response) => response?.data?.metaobjects,
  );
  return nodes.map((node) => ({
    id: node.id,
    handle: node.handle,
    ...Object.fromEntries((node.fields ?? []).map(({key, value}) => [key, value])),
  }));
}

export async function createProductFamily({name, slug}, env) {
  const definition = await getOrCreateProductFamilyDefinition(env);
  if (!definition.valid) {
    throw new Error(`Product Family definition is incompatible: ${definition.mismatches.join('; ')}.`);
  }
  const response = await adminQuery(
    `/* GraphQL */
      mutation CreateProductFamily($metaobject: MetaobjectCreateInput!) {
        metaobjectCreate(metaobject: $metaobject) {
          metaobject { id handle }
          userErrors { field message code }
        }
      }
    `,
    {metaobject: {
      type: PRODUCT_FAMILY_TYPE,
      handle: slug,
      fields: [
        {key: 'name', value: name},
        {key: 'slug', value: slug},
        {key: 'products', value: '[]'},
      ],
    }},
    env,
  );
  throwOnUserErrors(response?.data?.metaobjectCreate, 'Product Family creation failed');
  const family = response?.data?.metaobjectCreate?.metaobject;
  if (!family?.id) throw new Error('Product Family creation returned no ID.');
  return family;
}

export async function addProductToFamily(familyId, productId, env) {
  const current = await adminQuery(
    `/* GraphQL */
      query ProductFamilyProducts($id: ID!) {
        metaobject(id: $id) { id field(key: "products") { value } }
      }
    `,
    {id: familyId},
    env,
  );
  if (!current?.data?.metaobject?.id) throw new Error('Selected Product Family was not found.');
  let productIds = [];
  try {
    productIds = JSON.parse(current.data.metaobject.field?.value || '[]');
  } catch {
    throw new Error('Product Family products field is not a valid product-reference list.');
  }
  const value = JSON.stringify([...new Set([...productIds, productId])]);
  const update = await adminQuery(
    `/* GraphQL */
      mutation AddProductToFamily($id: ID!, $metaobject: MetaobjectUpdateInput!) {
        metaobjectUpdate(id: $id, metaobject: $metaobject) {
          metaobject { id }
          userErrors { field message code }
        }
      }
    `,
    {id: familyId, metaobject: {fields: [{key: 'products', value}]}},
    env,
  );
  throwOnUserErrors(update?.data?.metaobjectUpdate, 'Unable to add product to Product Family');
}

/**
 * Create a new Shopify Draft Product and its variant selections.
 * @param {Record<string, any>} productData
 * @param {Record<string, any>} env
 * @returns {Promise<any>}
 */
export async function createShopifyDraftProduct(productData, env) {
  // 1. Create the product and options
  const productCreateMutation = `/* GraphQL */
    mutation CreateProduct($product: ProductCreateInput!) {
      productCreate(product: $product) {
        product {
          id
          title
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const tags = ['uniinx-admin-created', ...(productData.tags ?? [])];

  const productInput = {
    title: productData.title,
    productType: productData.productType,
    vendor: productData.vendor || 'Uniinx Studio',
    descriptionHtml: productData.description || '',
    tags,
    status: 'DRAFT',
    productOptions: (productData.options ?? []).map((name) => ({name})),
  };

  const createRes = await adminQuery(productCreateMutation, {product: productInput}, env);
  const createErrors = createRes?.data?.productCreate?.userErrors;
  if (createErrors?.length) {
    throw new Error(`Product creation failed: ${createErrors[0].message}`);
  }

  const productId = createRes?.data?.productCreate?.product?.id;
  if (!productId) {
    throw new Error('Product creation returned no ID.');
  }

  try {
  // 2. Add variants in bulk
  if (productData.variants?.length) {
    const variantsMutation = `/* GraphQL */
      mutation CreateVariants($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
        productVariantsBulkCreate(productId: $productId, variants: $variants, strategy: REMOVE_STANDALONE_VARIANT) {
          productVariants {
            id
            title
            sku
            price
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variantsInput = productData.variants.map((v) => ({
      price: v.price,
      compareAtPrice: v.compareAtPrice || null,
      inventoryItem: {
        sku: v.sku,
        measurement: {
          weight: {value: parseFloat(v.weight || '0.3'), unit: 'KILOGRAMS'},
        },
      },
      optionValues: v.optionValues.map((ov) => ({
        optionName: ov.optionName,
        name: ov.name,
      })),
    }));

    const bulkRes = await adminQuery(
      variantsMutation,
      {
        productId,
        variants: variantsInput,
      },
      env,
    );

    const bulkErrors = bulkRes?.data?.productVariantsBulkCreate?.userErrors;
    if (bulkErrors?.length) {
      throw new Error(
        `Variant creation failed: ${bulkErrors.map(({message}) => message).join('; ')}`,
      );
    }
  }

  // 3. Save custom UniinX metafields
  const metafieldsMutation = `/* GraphQL */
    mutation SetMetafields($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields {
          id
          key
          value
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const referenceKeys = new Set(['design_reference', 'product_family']);
  const multilineKeys = new Set(['design_story', 'size_guide']);
  const metafields = Object.entries(productData.metafields ?? {}).map(([key, value]) => ({
    ownerId: productId,
    namespace: 'custom',
    key,
    value: value || '',
    type: referenceKeys.has(key)
      ? 'metaobject_reference'
      : multilineKeys.has(key)
        ? 'multi_line_text_field'
        : 'single_line_text_field',
  }));

  if (metafields.length) {
    const metafieldsRes = await adminQuery(metafieldsMutation, {metafields}, env);
    const metafieldErrors = metafieldsRes?.data?.metafieldsSet?.userErrors;
    if (metafieldErrors?.length) {
      throw new Error(
        `Metafield update failed: ${metafieldErrors.map(({message}) => message).join('; ')}`,
      );
    }
  }

  if (productData.familyId) {
    await addProductToFamily(productData.familyId, productId, env);
  }
  } catch (error) {
    await deleteShopifyProduct(productId, env).catch((cleanupError) => {
      console.error('Failed to roll back incomplete draft product:', cleanupError);
    });
    throw error;
  }

  return {id: productId, title: productData.title};
}

async function deleteShopifyProduct(productId, env) {
  const mutation = `/* GraphQL */
    mutation DeleteIncompleteProduct($input: ProductDeleteInput!) {
      productDelete(input: $input) {
        deletedProductId
        userErrors { message }
      }
    }
  `;
  const response = await adminQuery(mutation, {input: {id: productId}}, env);
  const errors = response?.data?.productDelete?.userErrors;
  if (errors?.length) throw new Error(errors.map(({message}) => message).join('; '));
}

export async function publishProductToStorefront(productId, env) {
  const publicationId = env.SHOPIFY_STOREFRONT_PUBLICATION_ID;
  if (!publicationId) {
    throw new Error(
      'Storefront publication is not configured. Set SHOPIFY_STOREFRONT_PUBLICATION_ID; activating a product alone does not make it live.',
    );
  }

  const update = await adminQuery(
    `/* GraphQL */
      mutation ActivateProduct($product: ProductUpdateInput!) {
        productUpdate(product: $product) {
          product { id status }
          userErrors { field message }
        }
      }
    `,
    {product: {id: productId, status: 'ACTIVE'}},
    env,
  );
  throwOnUserErrors(update?.data?.productUpdate, 'Unable to activate product');

  const publish = await adminQuery(
    `/* GraphQL */
      mutation PublishProduct($id: ID!, $input: [PublicationInput!]!, $publicationId: ID!) {
        publishablePublish(id: $id, input: $input) {
          publishable { publishedOnPublication(publicationId: $publicationId) }
          userErrors { field message }
        }
      }
    `,
    {id: productId, input: [{publicationId}], publicationId},
    env,
  );
  throwOnUserErrors(publish?.data?.publishablePublish, 'Unable to publish product to Storefront');
  if (!publish?.data?.publishablePublish?.publishable?.publishedOnPublication) {
    throw new Error('Shopify did not confirm publication to the configured Storefront publication.');
  }

  await adminQuery(
    `/* GraphQL */
      mutation MarkProductPublished($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) { userErrors { field message } }
      }
    `,
    {metafields: [{
      ownerId: productId,
      namespace: 'custom',
      key: 'catalog_status',
      value: 'Published',
      type: 'single_line_text_field',
    }]},
    env,
  ).then((response) => throwOnUserErrors(response?.data?.metafieldsSet, 'Unable to mark product published'));
}
