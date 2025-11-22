# Blog Posts CRUD Module

A complete blog posts management system built with SvelteKit and Supabase.

## Features

### Admin Features (Admin-only)
- **List Posts** - View all blog posts in a table
- **Create Post** - Rich text editor with auto-slug generation
- **Edit Post** - Update existing posts
- **Delete Post** - Remove posts with confirmation

### Public Features (No login required)
- **Blog List** - View all published posts
- **Single Post** - Read full post by slug
- **SEO Optimized** - Meta tags and semantic HTML

## Setup

### 1. Run Database Migration

Run this SQL in your Supabase SQL Editor:

```bash
# Copy contents of supabase/posts_schema.sql and run in Supabase
```

This creates:
- `posts` table with proper schema
- RLS policies (public read, admin write)
- Indexes for performance

### 2. Routes Created

**Admin Routes** (requires admin role):
- `/admin/posts` - List all posts
- `/admin/posts/new` - Create new post
- `/admin/posts/[id]` - Edit existing post

**Public Routes** (no login required):
- `/blog` - List all posts
- `/blog/[slug]` - View single post

### 3. File Structure

```
src/
├── lib/
│   └── posts.js                           # Reusable Supabase queries
├── routes/
│   ├── admin/
│   │   └── posts/
│   │       ├── +page.svelte               # Posts list view
│   │       ├── +page.server.js            # Load posts
│   │       ├── +server.js                 # Delete action
│   │       ├── new/
│   │       │   ├── +page.svelte           # Create form
│   │       │   └── +page.server.js        # Create action
│   │       └── [id]/
│   │           ├── +page.svelte           # Edit form
│   │           └── +page.server.js        # Update action
│   └── blog/
│       ├── +page.svelte                   # Public list
│       ├── +page.server.js                # Load posts
│       └── [slug]/
│           ├── +page.svelte               # Single post
│           └── +page.server.js            # Load post by slug

supabase/
└── posts_schema.sql                       # Database schema
```

## Usage

### Creating a Post

1. Log in as admin
2. Go to `/admin/posts`
3. Click "New Post"
4. Fill in:
   - **Title** - Post title (required)
   - **Slug** - URL-friendly slug (auto-generated from title)
   - **Body** - HTML content (supports rich text)
5. Click "Create Post"

### Editing a Post

1. Go to `/admin/posts`
2. Click "Edit" on any post
3. Update fields
4. Click "Update Post"

### Deleting a Post

1. Go to `/admin/posts`
2. Click "Delete" on any post
3. Confirm deletion

### Viewing Posts (Public)

- Visit `/blog` to see all posts
- Click any post to read the full content
- Posts are sorted by date (newest first)

## Database Schema

```sql
posts (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  body TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
)
```

**Indexes:**
- `posts_slug_idx` - Fast slug lookups
- `posts_created_at_idx` - Fast date sorting

**RLS Policies:**
- Anyone can read posts
- Only admins can create/update/delete

## Helper Functions

Located in `src/lib/posts.js`:

```javascript
getAllPosts(supabase)           // Get all posts
getPostBySlug(supabase, slug)   // Get single post by slug
getPostById(supabase, id)       // Get single post by ID
createPost(supabase, data)      // Create new post
updatePost(supabase, id, data)  // Update existing post
deletePost(supabase, id)        // Delete post
generateExcerpt(html, length)   // Generate excerpt from HTML
```

## HTML Support

The body field supports HTML. Common tags:

```html
<h1>Heading 1</h1>
<h2>Heading 2</h2>
<p>Paragraph text</p>
<strong>Bold text</strong>
<em>Italic text</em>
<a href="url">Link</a>
<ul><li>List item</li></ul>
<code>Inline code</code>
<pre><code>Code block</code></pre>
<blockquote>Quote</blockquote>
```

## Customization

### Change Excerpt Length

Edit `src/lib/posts.js`:

```javascript
export function generateExcerpt(html, maxLength = 200) { // Change 200
  // ...
}
```

### Add Rich Text Editor

Replace the textarea in `new/+page.svelte` and `[id]/+page.svelte` with a rich text editor like:
- TinyMCE
- Quill
- Tiptap

### Add Categories/Tags

1. Add columns to `posts` table
2. Update create/update functions in `src/lib/posts.js`
3. Add form fields in admin pages
4. Add filtering in public blog list

## Security

- ✅ Admin routes protected by RLS
- ✅ Server-side admin checks
- ✅ Public routes have no auth requirement
- ✅ Slug uniqueness enforced by database
- ✅ HTML sanitization recommended for production

## Next Steps

- [ ] Add rich text editor (TinyMCE, Quill, etc.)
- [ ] Add image upload support
- [ ] Add categories and tags
- [ ] Add draft/published status
- [ ] Add search functionality
- [ ] Add pagination for large blogs
- [ ] Add RSS feed
- [ ] Add social sharing buttons
