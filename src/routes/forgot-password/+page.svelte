<script>
    import { enhance } from "$app/forms";

    export let form;
</script>

<div class="flex justify-center items-center" style="min-height: 80vh;">
    <div class="card" style="width: 100%; max-width: 400px;">
        <h1 class="heading-2 text-center">Reset Password</h1>
        <p
            class="text-center text-muted"
            style="margin-bottom: var(--space-6);"
        >
            Enter your email to receive a reset link.
        </p>

        {#if form?.success}
            <div class="alert alert-success">
                {form.message}
            </div>
        {:else}
            {#if form?.error}
                <div class="alert alert-error">
                    {form.error}
                </div>
            {/if}

            <form method="POST" use:enhance class="flex flex-col gap-4">
                <div>
                    <label for="email" class="label">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        class="input"
                        required
                        placeholder="you@example.com"
                    />
                </div>

                <button
                    type="submit"
                    class="btn btn-primary"
                    style="width: 100%;">Send Reset Link</button
                >
            </form>

            <div
                class="text-center text-sm text-muted"
                style="margin-top: var(--space-4);"
            >
                <a href="/login" style="color: var(--color-primary);"
                    >Back to Login</a
                >
            </div>
        {/if}
    </div>
</div>
