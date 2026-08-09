import {Form, useActionData, useNavigation, redirect, Link} from 'react-router';
import {createDesignMetaobject, requireAdmin} from '~/lib/admin';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{title: 'Upload Design'}];
};

/**
 * @param {Route.ActionArgs}
 */
export async function action({request, context}) {
  requireAdmin(context);
  const {env} = context;
  const formData = await request.formData();

  const name = formData.get('name')?.toString();
  const language = formData.get('language')?.toString();
  const designer = formData.get('designer')?.toString();
  const story = formData.get('story')?.toString();
  const short_description = formData.get('short_description')?.toString();
  const artwork_url = formData.get('artwork_url')?.toString();
  const internal_code = formData.get('internal_code')?.toString();
  const status = formData.get('status')?.toString();
  const supportedLanguages = new Set(['Tamil', 'Telugu', 'Hindi', 'Kannada', 'Sanskrit', 'English']);

  if (!name?.trim() || name.length > 100 || !language || !designer?.trim() || !internal_code?.trim()) {
    return {error: 'Name, language, designer, and internal code are required.'};
  }
  if (!supportedLanguages.has(language)) {
    return {error: 'Select a supported language value.'};
  }
  if (story && story.length > 5000) {
    return {error: 'Design story must be 5,000 characters or fewer.'};
  }

  try {
    await createDesignMetaobject(
      {
        name,
        language,
        designer,
        story,
        short_description,
        artwork_url,
        internal_code,
        status,
      },
      env,
    );
    return redirect('/admin/designs');
  } catch (error) {
    return {error: error instanceof Error ? error.message : String(error)};
  }
}

export default function AdminNewDesign() {
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  return (
    <div className="flex flex-col gap-8 animate-fade-in text-black dark:text-white">
      {/* Header */}
      <div>
        <Link
          to="/admin/designs"
          className="font-work text-[9px] tracking-wider uppercase text-black/50 hover:text-black dark:text-white/40 dark:hover:text-white mb-4 inline-flex items-center gap-1 transition-all"
        >
          ← Back to designs
        </Link>
        <h3 className="font-marcellus text-2xl uppercase">
          Upload Design
        </h3>
        <p className="font-work text-xs text-black/50 dark:text-white/40 mt-1">
          Store reusable design parameters as a Shopify metaobject.
        </p>
      </div>

      <div className="w-full h-[1px] bg-black/10 dark:bg-white/10" />

      {/* Form */}
      <Form method="POST" className="flex flex-col gap-5 max-w-xl">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Design Name */}
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="design-name" className="font-work text-[9px] tracking-wider text-black/45 dark:text-white/30 uppercase">
              Design Name
            </label>
            <input
              id="design-name"
              type="text"
              name="name"
              required
              placeholder="e.g. Jigar Hoody Artwork"
              className="w-full px-4 py-3 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-black dark:text-white text-sm font-work font-light focus:outline-none focus:border-brand-accent dark:focus:border-brand-accent-light transition-all"
            />
          </div>

          {/* Language */}
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="design-language" className="font-work text-[9px] tracking-wider text-black/45 dark:text-white/30 uppercase">
              Language / Script
            </label>
            <select
              id="design-language"
              name="language"
              required
              className="w-full px-4 py-3 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-black dark:text-white text-sm font-work font-light focus:outline-none focus:border-brand-accent dark:focus:border-brand-accent-light transition-all"
            >
              <option value="Tamil">Tamil</option>
              <option value="Telugu">Telugu</option>
              <option value="Hindi">Hindi</option>
              <option value="Kannada">Kannada</option>
              <option value="Sanskrit">Sanskrit</option>
              <option value="English">English</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Designer Name */}
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="design-designer" className="font-work text-[9px] tracking-wider text-black/45 dark:text-white/30 uppercase">
              Designer Name
            </label>
            <input
              id="design-designer"
              type="text"
              name="designer"
              required
              placeholder="e.g. Siddharth"
              className="w-full px-4 py-3 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-black dark:text-white text-sm font-work font-light focus:outline-none focus:border-brand-accent dark:focus:border-brand-accent-light transition-all"
            />
          </div>

          {/* Internal Code */}
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="design-code" className="font-work text-[9px] tracking-wider text-black/45 dark:text-white/30 uppercase">
              Internal Design Code
            </label>
            <input
              id="design-code"
              type="text"
              name="internal_code"
              required
              placeholder="e.g. JGR"
              className="w-full px-4 py-3 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-black dark:text-white text-sm font-work font-light focus:outline-none focus:border-brand-accent dark:focus:border-brand-accent-light transition-all"
            />
          </div>
        </div>

        {/* Artwork Image URL */}
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="design-artwork" className="font-work text-[9px] tracking-wider text-black/45 dark:text-white/30 uppercase">
            Artwork Image URL
          </label>
          <input
            id="design-artwork"
            type="url"
            name="artwork_url"
            placeholder="https://example.com/mockup.png"
            className="w-full px-4 py-3 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-black dark:text-white text-sm font-work font-light focus:outline-none focus:border-brand-accent dark:focus:border-brand-accent-light transition-all"
          />
        </div>

        {/* Short Description */}
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="design-short" className="font-work text-[9px] tracking-wider text-black/45 dark:text-white/30 uppercase">
            Short Description
          </label>
          <input
            id="design-short"
            type="text"
            name="short_description"
            required
            placeholder="Linguistic artwork detail description..."
            className="w-full px-4 py-3 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-black dark:text-white text-sm font-work font-light focus:outline-none focus:border-brand-accent dark:focus:border-brand-accent-light transition-all"
          />
        </div>

        {/* Story */}
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="design-story" className="font-work text-[9px] tracking-wider text-black/45 dark:text-white/30 uppercase">
            Design Story
          </label>
          <textarea
            id="design-story"
            name="story"
            required
            rows={4}
            placeholder="Describe the story and linguistic history of this script..."
            className="w-full px-4 py-3 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-black dark:text-white text-sm font-work font-light focus:outline-none focus:border-brand-accent dark:focus:border-brand-accent-light transition-all resize-none"
          />
        </div>

        {/* Status */}
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="design-status" className="font-work text-[9px] tracking-wider text-black/45 dark:text-white/30 uppercase">
            Status
          </label>
          <select
            id="design-status"
            name="status"
            required
            className="w-full px-4 py-3 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-black dark:text-white text-sm font-work font-light focus:outline-none focus:border-brand-accent dark:focus:border-brand-accent-light transition-all"
          >
            <option value="Draft">Draft</option>
            <option value="Approved">Approved</option>
            <option value="Used in Product">Used in Product</option>
            <option value="Archived">Archived</option>
          </select>
        </div>

        {/* Error Alert */}
        {actionData?.error && (
          <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-400 font-work text-xs font-light">
            {actionData.error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-fit px-8 py-3.5 mt-2 rounded-full bg-brand-accent dark:bg-brand-accent-light text-brand-bg-light dark:text-brand-bg-dark font-work text-[10px] tracking-wider uppercase font-semibold hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer shadow-md disabled:opacity-50"
        >
          {isSubmitting ? 'Uploading Design...' : 'Commit Design'}
        </button>
      </Form>
    </div>
  );
}

/** @typedef {import('./+types/admin.designs.new').Route} Route */
