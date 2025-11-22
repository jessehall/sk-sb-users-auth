import { error } from '@sveltejs/kit';
import { getPostBySlug } from '$lib/posts';

export const load = async ({ params, locals: { supabase } }) => {
  const { post, error: postError } = await getPostBySlug(supabase, params.slug);

  if (postError || !post) {
    throw error(404, 'Post not found');
  }

  return {
    post
  };
};
