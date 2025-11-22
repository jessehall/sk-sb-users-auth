<script>
    import { enhance } from "$app/forms";
    export let data;
    export let form;

    let deletingUserId = null;
</script>

<div class="container">
    <div class="flex justify-between items-center mb-6">
        <h1 class="heading-1">User Management</h1>
        <a href="/admin" class="btn btn-outline">Back to Dashboard</a>
    </div>

    {#if form?.success}
        <div class="alert alert-success">
            {form.message}
        </div>
    {/if}

    {#if form?.error}
        <div class="alert alert-error">
            {form.error}
        </div>
    {/if}

    <div class="card overflow-x-auto">
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr
                    style="text-align: left; border-bottom: 1px solid var(--color-border);"
                >
                    <th class="p-2">Email</th>
                    <th class="p-2">Full Name</th>
                    <th class="p-2">Role</th>
                    <th class="p-2">Actions</th>
                </tr>
            </thead>
            <tbody>
                {#each data.profiles as profile}
                    <tr style="border-bottom: 1px solid var(--color-border);">
                        <td class="p-2">{profile.email || "N/A"}</td>
                        <td class="p-2">{profile.full_name || "N/A"}</td>
                        <td class="p-2">
                            <span
                                class="text-sm"
                                style="padding: 2px 6px; background: var(--color-bg); border-radius: 4px;"
                            >
                                {profile.role}
                            </span>
                        </td>
                        <td class="p-2 flex gap-2">
                            <form
                                action="?/resetPassword"
                                method="POST"
                                use:enhance
                            >
                                <input
                                    type="hidden"
                                    name="userId"
                                    value={profile.id}
                                />
                                <input
                                    type="hidden"
                                    name="email"
                                    value={profile.email}
                                />
                                <button
                                    type="submit"
                                    class="btn btn-outline text-sm"
                                    >Reset Pass</button
                                >
                            </form>

                            <form
                                action="?/deleteUser"
                                method="POST"
                                use:enhance={() => {
                                    deletingUserId = profile.id;
                                    return async ({ update }) => {
                                        await update();
                                        deletingUserId = null;
                                    };
                                }}
                                on:submit={(e) => {
                                    if (
                                        !confirm(
                                            `Are you sure you want to delete ${profile.email}? This action cannot be undone.`,
                                        )
                                    ) {
                                        e.preventDefault();
                                    }
                                }}
                            >
                                <input
                                    type="hidden"
                                    name="userId"
                                    value={profile.id}
                                />
                                <button
                                    type="submit"
                                    class="btn btn-danger text-sm"
                                    disabled={deletingUserId === profile.id}
                                >
                                    {deletingUserId === profile.id
                                        ? "Deleting..."
                                        : "Delete"}
                                </button>
                            </form>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>
