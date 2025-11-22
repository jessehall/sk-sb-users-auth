<script>
    export let data;

    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }
</script>

<div class="container">
    <div class="flex justify-between items-center mb-6">
        <h1 class="heading-1">Blog Posts</h1>
        <div class="flex gap-2">
            <a href="/admin" class="btn btn-outline">Back to Admin</a>
            <a href="/admin/posts/new" class="btn btn-primary">New Post</a>
        </div>
    </div>

    {#if data.error}
        <div class="alert alert-error">
            Error loading posts: {data.error.message}
        </div>
    {/if}

    {#if data.posts && data.posts.length > 0}
        <div class="card overflow-x-auto">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr
                        style="text-align: left; border-bottom: 1px solid var(--color-border);"
                    >
                        <th class="p-2">Title</th>
                        <th class="p-2">Slug</th>
                        <th class="p-2">Created</th>
                        <th class="p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {#each data.posts as post}
                        <tr
                            style="border-bottom: 1px solid var(--color-border);"
                        >
                            <td class="p-2">
                                <a
                                    href="/blog/{post.slug}"
                                    target="_blank"
                                    style="color: var(--color-primary);"
                                >
                                    {post.title}
                                </a>
                            </td>
                            <td class="p-2 text-muted">{post.slug}</td>
                            <td class="p-2 text-muted"
                                >{formatDate(post.created_at)}</td
                            >
                            <td class="p-2 flex gap-2">
                                <a
                                    href="/blog/{post.slug}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="btn btn-outline text-sm"
                                >
                                    View Post
                                </a>
                                <a
                                    href="/admin/posts/{post.id}"
                                    class="btn btn-outline text-sm">Edit</a
                                >
                                <form
                                    method="POST"
                                    action="/admin/posts?/delete"
                                    style="display: inline;"
                                >
                                    <input
                                        type="hidden"
                                        name="id"
                                        value={post.id}
                                    />
                                    <button
                                        type="submit"
                                        class="btn btn-danger text-sm"
                                        on:click={(e) => {
                                            if (
                                                !confirm(
                                                    `Delete "${post.title}"? This cannot be undone.`,
                                                )
                                            ) {
                                                e.preventDefault();
                                            }
                                        }}
                                    >
                                        Delete
                                    </button>
                                </form>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {:else}
        <div class="card text-center">
            <p class="text-muted">No posts yet.</p>
            <a href="/admin/posts/new" class="btn btn-primary mt-4"
                >Create Your First Post</a
            >
        </div>
    {/if}
</div>
