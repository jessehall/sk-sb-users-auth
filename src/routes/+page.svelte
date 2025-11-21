<script>
    import "../styles/global.css";
</script>

<div
    class="container flex flex-col items-center justify-center"
    style="min-height: 80vh; text-align: center;"
>
    <h1
        class="heading-1"
        style="font-size: 4rem; margin-bottom: var(--space-6);"
    >
        Build <span style="color: var(--color-primary);">Faster</span>
    </h1>
    <p
        class="text-muted"
        style="font-size: var(--font-size-xl); max-width: 600px; margin-bottom: var(--space-8);"
    >
        The ultimate starter kit for SvelteKit, Supabase, and Resend.
        Authentication, User Management, and Admin Dashboard ready to go.
    </p>

    <div class="flex gap-4">
        <a
            href="/signup"
            class="btn btn-primary"
            style="padding: var(--space-3) var(--space-8); font-size: var(--font-size-lg);"
            >Get Started</a
        >
        <a
            href="/demo/protected-partial"
            class="btn btn-outline"
            style="padding: var(--space-3) var(--space-8); font-size: var(--font-size-lg);"
            >View Demo</a
        >
    </div>
</div>
