<script>
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";

    onMount(() => {
        // Auto-submit the logout form
        document.getElementById("logout-form").submit();
    });
</script>

<div class="flex justify-center items-center" style="min-height: 80vh;">
    <div
        class="card"
        style="width: 100%; max-width: 400px; text-align: center;"
    >
        <h1 class="heading-2">Logging out...</h1>
        <p class="text-muted">Please wait while we log you out.</p>

        <form id="logout-form" method="POST" style="display: none;">
            <button type="submit">Logout</button>
        </form>
    </div>
</div>
