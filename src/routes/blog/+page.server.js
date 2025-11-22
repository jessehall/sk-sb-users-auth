import { getAllPosts, generateExcerpt } from '$lib/posts';

export const load = async ({ locals: { supabase } }) => {
  const { posts, error } = await getAllPosts(supabase);

  // Add excerpts to posts
  const postsWithExcerpts = posts?.map(post => ({
    ...post,
    excerpt: generateExcerpt(post.body)
  })) || [];

  return {
    posts: postsWithExcerpts,
    error
  };
};
