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

<svelte:head>
    <title>{data.post.title} | Blog</title>
    <meta name="description" content={data.post.body.substring(0, 160)} />
</svelte:head>

<div class="container" style="max-width: 800px;">
    <article>
        <header style="margin-bottom: var(--space-8);">
            <a
                href="/blog"
                class="text-sm"
                style="color: var(--color-primary); margin-bottom: var(--space-4); display: inline-block;"
            >
                ← Back to Blog
            </a>

            <h1 class="heading-1" style="margin-bottom: var(--space-2);">
                {data.post.title}
            </h1>

            <p class="text-muted">
                {formatDate(data.post.created_at)}
            </p>
        </header>

        <div class="card" style="line-height: 1.8;">
            {@html data.post.body}
        </div>
    </article>
</div>

<style>
    /* Style the rendered HTML content */
    article :global(h1) {
        font-size: var(--font-size-2xl);
        font-weight: 700;
        margin-top: var(--space-8);
        margin-bottom: var(--space-4);
    }

    article :global(h2) {
        font-size: var(--font-size-xl);
        font-weight: 600;
        margin-top: var(--space-6);
        margin-bottom: var(--space-3);
    }

    article :global(h3) {
        font-size: var(--font-size-lg);
        font-weight: 600;
        margin-top: var(--space-4);
        margin-bottom: var(--space-2);
    }

    article :global(p) {
        margin-bottom: var(--space-4);
    }

    article :global(ul),
    article :global(ol) {
        margin-bottom: var(--space-4);
        padding-left: var(--space-6);
    }

    article :global(li) {
        margin-bottom: var(--space-2);
    }

    article :global(a) {
        color: var(--color-primary);
        text-decoration: underline;
    }

    article :global(code) {
        background: var(--color-bg);
        padding: 2px 6px;
        border-radius: 4px;
        font-family: monospace;
        font-size: 0.9em;
    }

    article :global(pre) {
        background: var(--color-bg);
        padding: var(--space-4);
        border-radius: 8px;
        overflow-x: auto;
        margin-bottom: var(--space-4);
    }

    article :global(pre code) {
        background: none;
        padding: 0;
    }

    article :global(blockquote) {
        border-left: 4px solid var(--color-primary);
        padding-left: var(--space-4);
        margin-left: 0;
        margin-bottom: var(--space-4);
        font-style: italic;
        color: var(--color-text-muted);
    }

    article :global(img) {
        max-width: 100%;
        height: auto;
        border-radius: 8px;
        margin-bottom: var(--space-4);
    }
</style>
