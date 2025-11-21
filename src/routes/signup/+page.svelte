<script>
    import { enhance } from "$app/forms";

    export let form;
</script>

<div class="flex justify-center items-center" style="min-height: 80vh;">
    <div class="card" style="width: 100%; max-width: 400px;">
        <h1 class="heading-2 text-center">Create an Account</h1>
        <p
            class="text-center text-muted"
            style="margin-bottom: var(--space-6);"
        >
            Join us today
        </p>

        {#if form?.error}
            <div class="alert alert-error">
                {form.error}
            </div>
        {/if}

        {#if form?.success}
            <div class="alert alert-success">
                {form.message}
            </div>
        {:else}
            <form action="?/loginWithGoogle" method="POST" use:enhance>
                <button
                    type="submit"
                    class="btn btn-outline"
                    style="width: 100%; margin-bottom: var(--space-4);"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        style="margin-right: var(--space-2);"
                    >
                        <path
                            d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.908 8.908 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z"
                        />
                    </svg>
                    Sign up with Google
                </button>
            </form>

            <div
                class="text-center text-muted"
                style="margin-bottom: var(--space-4); font-size: var(--font-size-sm);"
            >
                OR
            </div>

            <form
                action="?/signup"
                method="POST"
                use:enhance
                class="flex flex-col gap-4"
            >
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

                <div>
                    <label for="password" class="label">Password</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        class="input"
                        required
                        placeholder="••••••••"
                    />
                </div>

                <button
                    type="submit"
                    class="btn btn-primary"
                    style="width: 100%;">Sign Up</button
                >
            </form>

            <div
                class="text-center text-sm text-muted"
                style="margin-top: var(--space-4);"
            >
                Already have an account? <a
                    href="/login"
                    style="color: var(--color-primary);">Log in</a
                >
            </div>
        {/if}
    </div>
</div>
