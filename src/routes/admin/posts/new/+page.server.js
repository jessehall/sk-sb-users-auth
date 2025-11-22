import { fail, redirect } from '@sveltejs/kit';
import { createPost } from '$lib/posts';

export const load = async ({ locals: { supabase, safeGetSession } }) => {
  // Check if user is admin
  const { user } = await safeGetSession();
  
  if (!user) {
    throw redirect(303, '/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    throw redirect(303, '/');
  }

  return {};
};

export const actions = {
  default: async ({ request, locals: { supabase, safeGetSession } }) => {
    // Check admin
    const { user } = await safeGetSession();
    if (!user) return fail(401);

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') return fail(403);

    // Get form data
    const formData = await request.formData();
    const title = formData.get('title');
    const slug = formData.get('slug');
    const body = formData.get('body');

    // Validate
    if (!title || !slug || !body) {
      return fail(400, { error: 'Title, slug, and body are required' });
    }

    // Create post
    const { post, error } = await createPost(supabase, { title, slug, body });

    if (error) {
      return fail(500, { error: error.message });
    }

    // Redirect to posts list
    throw redirect(303, '/admin/posts');
  }
};
