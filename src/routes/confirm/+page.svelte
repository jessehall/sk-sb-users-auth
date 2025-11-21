<script>
    import { enhance } from "$app/forms";
    import { page } from "$app/stores";

    export let form;
    let email = $page.url.searchParams.get("email") || "";
</script>

<div class="flex justify-center items-center" style="min-height: 80vh;">
    <div class="card" style="width: 100%; max-width: 400px;">
        <h1 class="heading-2 text-center">Verify Your Account</h1>
        <p
            class="text-center text-muted"
            style="margin-bottom: var(--space-6);"
        >
            Enter the code sent to {email}.
        </p>

        {#if form?.error}
            <div class="alert alert-error">
                {form.error}
            </div>
        {/if}

        <form method="POST" use:enhance class="flex flex-col gap-4">
            <input type="hidden" name="email" value={email} />

            <div>
                <label for="code" class="label">Confirmation Code</label>
                <input
                    type="text"
                    name="code"
                    id="code"
                    class="input"
                    required
                    placeholder="123456"
                />
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%;"
                >Verify</button
            >
        </form>
    </div>
</div>
