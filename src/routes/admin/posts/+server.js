import { fail, redirect } from '@sveltejs/kit';
import { deletePost } from '$lib/posts';

export const actions = {
  delete: async ({ request, locals: { supabase, safeGetSession } }) => {
    // Check admin
    const { user } = await safeGetSession();
    if (!user) return fail(401);

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') return fail(403);

    // Get post ID from form
    const formData = await request.formData();
    const id = formData.get('id');

    if (!id) return fail(400, { error: 'Post ID required' });

    // Delete post
    const { error } = await deletePost(supabase, id);

    if (error) {
      return fail(500, { error: error.message });
    }

    // Redirect back to list
    throw redirect(303, '/admin/posts');
  }
};
