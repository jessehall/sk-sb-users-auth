import { redirect } from '@sveltejs/kit';
import { getAllPosts } from '$lib/posts';

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

  // Fetch all posts
  const { posts, error } = await getAllPosts(supabase);

  return {
    posts,
    error
  };
};
