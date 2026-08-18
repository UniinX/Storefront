import {Form, useLoaderData, useNavigation, useActionData, Link} from 'react-router';
import {
  checkAccessScopes,
  adminQuery,
  initializeAdminSchema,
  PRODUCT_METAFIELD_DEFINITIONS,
  requireAdmin,
} from '~/lib/admin';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{title: 'Admin Console Setup'}];
};

/**
 * @param {Route.LoaderArgs}
 */
export async function loader({context}) {
  const {env} = context;
  requireAdmin(context);

  const requiredScopes = [
    'read_metaobjects',
    'write_metaobjects',
    'read_metaobject_definitions',
    'write_metaobject_definitions',
    'read_products',
    'write_products',
    'read_inventory',
    'write_publications',
  ];

  let currentScopes = [];
  let scopeErrors = null;
  let schemaExists = false;
  let familySchemaExists = false;
  let productDefinitionsCount = 0;
  let schemaError = null;

  // 2. Fetch current access scopes
  try {
    currentScopes = await checkAccessScopes(env);
  } catch (e) {
    console.error('Failed fetching scopes:', e);
    scopeErrors = e instanceof Error ? e.message : String(e);
  }

  // 3. Check if metaobject definition exists
  try {
    const res = await adminQuery(
      `/* GraphQL */
      query CheckDesignDefinition($type: String!) {
        metaobjectDefinitionByType(type: $type) {
          id
          type
          access { storefront }
        }
      }
      `,
      {type: 'uniinx_design'},
      env,
    );
    schemaExists = Boolean(
      res?.data?.metaobjectDefinitionByType
      && res.data.metaobjectDefinitionByType.access?.storefront === 'PUBLIC_READ',
    );
    const familyRes = await adminQuery(
      `/* GraphQL */ query CheckFamilyDefinition($type: String!) {
        metaobjectDefinitionByType(type: $type) {
          id access { storefront } fieldDefinitions { key type { name } }
        }
        metafieldDefinitions(ownerType: PRODUCT, first: 100, query: "namespace:custom") {
          nodes { key type { name } access { storefront } }
        }
      }`,
      {type: 'product_family'},
      env,
    );
    const familyDefinition = familyRes?.data?.metaobjectDefinitionByType;
    const familyFields = new Map((familyDefinition?.fieldDefinitions ?? []).map(({key, type}) => [key, type?.name]));
    familySchemaExists = Boolean(
      familyDefinition
      && familyDefinition.access?.storefront === 'PUBLIC_READ'
      && familyFields.get('name') === 'single_line_text_field'
      && familyFields.get('slug') === 'single_line_text_field'
      && familyFields.get('products') === 'list.product_reference',
    );
    const definitions = new Map(
      (familyRes?.data?.metafieldDefinitions?.nodes ?? []).map((definition) => [definition.key, definition]),
    );
    productDefinitionsCount = PRODUCT_METAFIELD_DEFINITIONS.filter(([, key, type]) => {
      const definition = definitions.get(key);
      return definition?.type?.name === type && definition.access?.storefront === 'PUBLIC_READ';
    }).length;
  } catch (e) {
    console.error('Failed checking definition existence:', e);
    schemaError = e instanceof Error ? e.message : String(e);
  }

  const missingScopes = requiredScopes.filter((s) => !currentScopes.includes(s));

  return {
    currentScopes,
    missingScopes,
    schemaExists,
    familySchemaExists,
    productDefinitionsCount,
    scopeErrors,
    schemaError,
  };
}

/**
 * @param {Route.ActionArgs}
 */
export async function action({request, context}) {
  requireAdmin(context);
  const {env} = context;
  const formData = await request.formData();
  const actionType = formData.get('actionType')?.toString();

  if (actionType === 'INITIALIZE_SCHEMA') {
    try {
      const result = await initializeAdminSchema(env);
      if (!result.family.valid || !result.productMetafields.valid) {
        return {error: [...result.family.mismatches, ...result.productMetafields.mismatches].join('; ')};
      }
      return {success: true, created: result.productMetafields.created};
    } catch (e) {
      return {error: e instanceof Error ? e.message : String(e)};
    }
  }

  return {};
}

export default function AdminSetup() {
  /** @type {LoaderReturnData} */
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  const {missingScopes, schemaExists, familySchemaExists, productDefinitionsCount, scopeErrors, schemaError} = loaderData;
  const schemaComplete = schemaExists && familySchemaExists && productDefinitionsCount === PRODUCT_METAFIELD_DEFINITIONS.length;
  const hasErrors = missingScopes.length > 0 || scopeErrors || !schemaComplete;

  return (
    <div className="max-w-3xl mx-auto px-6 py-20 text-black dark:text-white min-h-screen">
      <div className="border border-black/5 dark:border-white/5 rounded-2xl p-8 bg-brand-surface-light dark:bg-brand-surface-dark shadow-sm flex flex-col gap-8">
        
        {/* Header */}
        <div>
          <span className="font-work text-xs tracking-[0.2em] text-brand-accent dark:text-brand-accent-light uppercase mb-2 block">
            System Initialization
          </span>
          <h2 className="font-marcellus text-3xl uppercase">
            Admin Console Setup
          </h2>
          <p className="font-work text-xs text-black/50 dark:text-white/40 mt-1">
            Verify Shopify access, Product Family, and the shared product metafield contract.
          </p>
        </div>

        <div className="w-full h-[1px] bg-black/5 dark:bg-white/5" />

        {/* 1. Scopes Checklist */}
        <div className="flex flex-col gap-4">
          <h3 className="font-marcellus text-sm uppercase tracking-wider text-black/60 dark:text-white/50">
            1. Access Scopes Verification
          </h3>
          
          {scopeErrors ? (
            <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-400 font-work text-xs">
              Failed querying app credentials: {scopeErrors}
            </div>
          ) : missingScopes.length > 0 ? (
            <div className="p-5 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 text-yellow-700 dark:text-yellow-400 font-work text-xs flex flex-col gap-3">
              <span className="font-semibold uppercase tracking-wider text-[10px]">
                ⚠️ Access Scopes Missing
              </span>
              <p>Your custom app token is missing the following access permissions:</p>
              <ul className="list-disc pl-5 font-mono text-[10px] flex flex-col gap-1">
                {missingScopes.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
              <p className="opacity-90">
                To fix this, edit the custom app configuration in your <strong>Shopify Admin → Settings → Apps and sales channels → Develop apps</strong> panel, check these permissions, save, and reinstall the app to update the token.
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-green-500/20 bg-green-500/5 text-green-600 dark:text-green-400 font-work text-xs flex items-center gap-2">
              <span>✓ Required product, metaobject, and publication scopes are verified.</span>
            </div>
          )}
        </div>

        {/* 2. Schema Checklist */}
        <div className="flex flex-col gap-4">
          <h3 className="font-marcellus text-sm uppercase tracking-wider text-black/60 dark:text-white/50">
            2. Storefront Product Schema
          </h3>

          {schemaComplete ? (
            <div className="p-4 rounded-xl border border-green-500/20 bg-green-500/5 text-green-600 dark:text-green-400 font-work text-xs flex items-center gap-2">
              <span>✓ Design, Product Family, and all {PRODUCT_METAFIELD_DEFINITIONS.length} product metafield definitions exist.</span>
            </div>
          ) : (
            <div className="p-5 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 text-yellow-700 dark:text-yellow-400 font-work text-xs flex flex-col gap-4">
              <span className="font-semibold uppercase tracking-wider text-[10px]">
                ⚠️ Storefront Schema Incomplete
              </span>
              <p>
                Design: {schemaExists ? 'ready' : 'missing'} · Product Family: {familySchemaExists ? 'ready' : 'missing'} · Product metafields: {productDefinitionsCount}/{PRODUCT_METAFIELD_DEFINITIONS.length}.
              </p>
              {missingScopes.length > 0 ? (
                <p className="opacity-80">
                  You must grant the missing access scopes first before creating the definition.
                </p>
              ) : (
                <Form method="POST">
                  <input type="hidden" name="actionType" value="INITIALIZE_SCHEMA" />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 rounded-full bg-black dark:bg-white text-white dark:text-black font-work text-[9px] tracking-wider uppercase font-semibold hover:opacity-95 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? 'Initializing Schema...' : 'Initialize / Verify Storefront Schema'}
                  </button>
                </Form>
              )}
            </div>
          )}

          {actionData?.error && (
            <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-400 font-work text-xs">
              Creation error: {actionData.error}
            </div>
          )}
          {actionData?.success && (
            <div className="p-4 rounded-xl border border-green-500/20 bg-green-500/5 text-green-600 dark:text-green-400 font-work text-xs">
              Schema verified. Created definitions: {actionData.created?.join(', ') || 'none'}.
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="flex items-center justify-between border-t border-black/5 dark:border-white/5 pt-6 mt-4">
          <Link
            to="/admin"
            className="px-6 py-3 rounded-xl border border-black/10 dark:border-white/10 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 font-work text-[10px] tracking-wider uppercase font-semibold transition-all"
          >
            Back to Dashboard
          </Link>
          {!hasErrors && (
            <span className="font-work text-xs text-green-600 dark:text-green-400 font-medium">
              ✓ Setup is complete and fully operational.
            </span>
          )}
        </div>

      </div>
    </div>
  );
}

/** @typedef {import('./+types/admin.setup').Route} Route */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
