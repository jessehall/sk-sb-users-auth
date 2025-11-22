/**
 * Reusable Supabase queries for posts
 * Can be used in both admin and public routes
 */

/**
 * Get all posts, ordered by created_at descending
 */
export async function getAllPosts(supabase) {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
    return { posts: [], error };
  }

  return { posts: data, error: null };
}

/**
 * Get a single post by slug
 */
export async function getPostBySlug(supabase, slug) {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching post by slug:', error);
    return { post: null, error };
  }

  return { post: data, error: null };
}

/**
 * Get a single post by ID
 */
export async function getPostById(supabase, id) {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching post by id:', error);
    return { post: null, error };
  }

  return { post: data, error: null };
}

/**
 * Create a new post
 */
export async function createPost(supabase, { title, slug, body }) {
  const { data, error } = await supabase
    .from('posts')
    .insert({ title, slug, body })
    .select()
    .single();

  if (error) {
    console.error('Error creating post:', error);
    return { post: null, error };
  }

  return { post: data, error: null };
}

/**
 * Update an existing post
 */
export async function updatePost(supabase, id, { title, slug, body }) {
  const { data, error } = await supabase
    .from('posts')
    .update({ title, slug, body })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating post:', error);
    return { post: null, error };
  }

  return { post: data, error: null };
}

/**
 * Delete a post
 */
export async function deletePost(supabase, id) {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting post:', error);
    return { error };
  }

  return { error: null };
}

/**
 * Generate excerpt from HTML body
 */
export function generateExcerpt(html, maxLength = 150) {
  // Strip HTML tags
  const text = html.replace(/<[^>]*>/g, '');
  // Truncate and add ellipsis if needed
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}
