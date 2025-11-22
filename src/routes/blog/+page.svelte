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
    <h1 class="heading-1" style="margin-bottom: var(--space-8);">Blog</h1>

    {#if data.error}
        <div class="alert alert-error">
            Error loading posts: {data.error.message}
        </div>
    {/if}

    {#if data.posts && data.posts.length > 0}
        <div class="flex flex-col gap-6">
            {#each data.posts as post}
                <article class="card">
                    <h2
                        class="heading-2"
                        style="margin-bottom: var(--space-2);"
                    >
                        <a
                            href="/blog/{post.slug}"
                            style="color: inherit; text-decoration: none;"
                        >
                            {post.title}
                        </a>
                    </h2>

                    <p
                        class="text-muted text-sm"
                        style="margin-bottom: var(--space-4);"
                    >
                        {formatDate(post.created_at)}
                    </p>

                    <p
                        class="text-muted"
                        style="margin-bottom: var(--space-4);"
                    >
                        {post.excerpt}
                    </p>

                    <a href="/blog/{post.slug}" class="btn btn-outline">
                        Read More →
                    </a>
                </article>
            {/each}
        </div>
    {:else}
        <div class="card text-center">
            <p class="text-muted">No posts yet. Check back soon!</p>
        </div>
    {/if}
</div>
