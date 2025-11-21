<script>
    import { enhance } from "$app/forms";

    export let form;
</script>

<div class="flex justify-center items-center" style="min-height: 80vh;">
    <div class="card" style="width: 100%; max-width: 400px;">
        <h1 class="heading-2 text-center">Update Password</h1>
        <p
            class="text-center text-muted"
            style="margin-bottom: var(--space-6);"
        >
            Enter your new password.
        </p>

        {#if form?.error}
            <div class="alert alert-error">
                {form.error}
            </div>
        {/if}

        <form method="POST" use:enhance class="flex flex-col gap-4">
            <div>
                <label for="password" class="label">New Password</label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    class="input"
                    required
                    placeholder="••••••••"
                />
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%;"
                >Update Password</button
            >
        </form>
    </div>
</div>
