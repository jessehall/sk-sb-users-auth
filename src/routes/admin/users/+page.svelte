<script>
    import { enhance } from "$app/forms";
    export let data;
</script>

<div class="container">
    <div class="flex justify-between items-center mb-6">
        <h1 class="heading-1">User Management</h1>
        <a href="/admin" class="btn btn-outline">Back to Dashboard</a>
    </div>

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
                            <!-- Disable user would go here -->
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>
