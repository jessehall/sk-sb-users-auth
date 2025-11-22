import { fail, redirect, error } from '@sveltejs/kit';
import { getPostById, updatePost } from '$lib/posts';

export const load = async ({ params, locals: { supabase, safeGetSession } }) => {
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

  // Fetch post by ID
  const { post, error: postError } = await getPostById(supabase, params.id);

  if (postError || !post) {
    throw error(404, 'Post not found');
  }

  return {
    post
  };
};

export const actions = {
  default: async ({ request, params, locals: { supabase, safeGetSession } }) => {
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

    // Update post
    const { post, error: updateError } = await updatePost(supabase, params.id, {
      title,
      slug,
      body
    });

    if (updateError) {
      return fail(500, { error: updateError.message });
    }

    // Redirect to posts list
    throw redirect(303, '/admin/posts');
  }
};
