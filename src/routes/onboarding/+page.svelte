<script>
    import { enhance } from "$app/forms";

    export let form;
    export let data;
</script>

<div class="flex justify-center items-center" style="min-height: 80vh;">
    <div class="card" style="width: 100%; max-width: 500px;">
        <h1 class="heading-2 text-center">Welcome!</h1>
        <p
            class="text-center text-muted"
            style="margin-bottom: var(--space-6);"
        >
            Let's set up your profile.
        </p>

        {#if form?.error}
            <div class="alert alert-error">
                {form.error}
            </div>
        {/if}

        <form method="POST" use:enhance class="flex flex-col gap-4">
            <div>
                <label for="fullName" class="label">Full Name</label>
                <input
                    type="text"
                    name="fullName"
                    id="fullName"
                    class="input"
                    required
                    placeholder="Jane Doe"
                    value={data.profile?.full_name || ""}
                />
            </div>

            <div>
                <label for="username" class="label">Username</label>
                <input
                    type="text"
                    name="username"
                    id="username"
                    class="input"
                    required
                    placeholder="janedoe"
                    value={data.profile?.username || ""}
                />
            </div>

            <div>
                <label for="website" class="label">Website (Optional)</label>
                <input
                    type="url"
                    name="website"
                    id="website"
                    class="input"
                    placeholder="https://example.com"
                    value={data.profile?.website || ""}
                />
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%;"
                >Complete Profile</button
            >
        </form>
    </div>
</div>
