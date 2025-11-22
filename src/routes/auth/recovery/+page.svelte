<script>
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { createBrowserClient } from "@supabase/ssr";
    import {
        PUBLIC_SUPABASE_URL,
        PUBLIC_SUPABASE_ANON_KEY,
    } from "$env/static/public";

    let error = "";
    let loading = true;

    onMount(async () => {
        // Create browser client
        const supabase = createBrowserClient(
            PUBLIC_SUPABASE_URL,
            PUBLIC_SUPABASE_ANON_KEY,
        );

        // Get hash parameters (tokens are in the URL hash for password recovery)
        const hashParams = new URLSearchParams(
            window.location.hash.substring(1),
        );
        const access_token = hashParams.get("access_token");
        const refresh_token = hashParams.get("refresh_token");
        const type = hashParams.get("type");

        if (access_token && refresh_token && type === "recovery") {
            // Set the session with the recovery tokens
            const { error: sessionError } = await supabase.auth.setSession({
                access_token,
                refresh_token,
            });

            if (sessionError) {
                console.error("Error setting session:", sessionError);
                error = "Invalid or expired recovery link";
                loading = false;
                return;
            }

            // Session set successfully, redirect to update password
            goto("/update-password");
        } else {
            error = "Invalid recovery link";
            loading = false;
        }
    });
</script>

<div class="flex justify-center items-center" style="min-height: 80vh;">
    <div class="card" style="width: 100%; max-width: 400px; text-center;">
        {#if loading}
            <h1 class="heading-2">Verifying recovery link...</h1>
            <p class="text-muted" style="margin-top: var(--space-4);">
                Please wait while we verify your password reset link.
            </p>
            <div style="margin-top: var(--space-6);">
                <div class="spinner"></div>
            </div>
        {:else if error}
            <h1 class="heading-2">Error</h1>
            <div class="alert alert-error" style="margin-top: var(--space-4);">
                {error}
            </div>
            <a
                href="/forgot-password"
                class="btn btn-primary"
                style="margin-top: var(--space-4);"
            >
                Request New Link
            </a>
        {/if}
    </div>
</div>

<style>
    .spinner {
        width: 40px;
        height: 40px;
        margin: 0 auto;
        border: 4px solid var(--color-border);
        border-top-color: var(--color-primary);
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
</style>
