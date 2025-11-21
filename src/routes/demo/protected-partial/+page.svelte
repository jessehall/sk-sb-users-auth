<script>
    export let data;
    // data.user comes from the layout
</script>

<div class="container">
    <h1 class="heading-1">Protected Page (Partial)</h1>

    <div class="card mb-8">
        <h2 class="heading-2">Public Content</h2>
        <p>This content is visible to everyone, regardless of login status.</p>
        <p class="text-muted">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
    </div>

    {#if data.user}
        <div class="card" style="border-color: var(--color-primary);">
            <h2 class="heading-2" style="color: var(--color-primary);">
                Premium Content
            </h2>
            <p>
                You are seeing this because you are logged in as <strong
                    >{data.user.email}</strong
                >.
            </p>
            <p>Here is some exclusive data: 12345-ABCDE.</p>
        </div>
    {:else}
        <div class="card" style="background-color: var(--color-bg);">
            <h2 class="heading-2 text-muted">Premium Content</h2>
            <p class="text-muted">Log in to see this section.</p>
            <a href="/login" class="btn btn-primary mt-4">Log In</a>
        </div>
    {/if}
</div>
