<script>
    import { enhance } from "$app/forms";
    import { goto } from "$app/navigation";

    export let form;

    // If password was updated successfully, redirect after a short delay
    $: if (form?.success) {
        setTimeout(() => {
            goto("/login");
        }, 2000);
    }
</script>

<div class="flex justify-center items-center" style="min-height: 80vh;">
    <div class="card" style="width: 100%; max-width: 400px;">
        <h1 class="heading-2 text-center">Update Password</h1>
        <p
            class="text-center text-muted"
            style="margin-bottom: var(--space-6);"
        >
            Enter your new password below.
        </p>

        {#if form?.error}
            <div class="alert alert-error">
                {form.error}
            </div>
        {/if}

        {#if form?.success}
            <div class="alert alert-success">
                {form.message}
                <p class="text-sm" style="margin-top: var(--space-2);">
                    Redirecting to login...
                </p>
            </div>
        {:else}
            <form method="POST" use:enhance class="flex flex-col gap-4">
                <div>
                    <label for="password" class="label">New Password</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        class="input"
                        required
                        minlength="6"
                        placeholder="••••••••"
                    />
                    <p
                        class="text-sm text-muted"
                        style="margin-top: var(--space-2);"
                    >
                        At least 6 characters
                    </p>
                </div>

                <div>
                    <label for="confirmPassword" class="label"
                        >Confirm Password</label
                    >
                    <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        class="input"
                        required
                        minlength="6"
                        placeholder="••••••••"
                    />
                </div>

                <button
                    type="submit"
                    class="btn btn-primary"
                    style="width: 100%;"
                >
                    Update Password
                </button>
            </form>
        {/if}
    </div>
</div>
