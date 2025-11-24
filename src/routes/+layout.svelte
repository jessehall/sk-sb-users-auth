<script>
  import "../styles/global.css";
  import { invalidate } from "$app/navigation";
  import { onMount } from "svelte";
  import { createBrowserClient } from "@supabase/ssr";
  import { goto } from "$app/navigation";
  import {
    PUBLIC_SUPABASE_ANON_KEY,
    PUBLIC_SUPABASE_URL,
  } from "$env/static/public";

  export let data;

  let { user } = data;
  $: ({ user } = data);

  const supabaseClient = createBrowserClient(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY,
  );

  onMount(() => {
    // Check for password recovery tokens in URL hash
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const access_token = hashParams.get("access_token");
    const refresh_token = hashParams.get("refresh_token");
    const type = hashParams.get("type");

    // If this is a password recovery link, handle it
    if (access_token && refresh_token && type === "recovery") {
      console.log("Password recovery detected, setting session...");

      supabaseClient.auth
        .setSession({
          access_token,
          refresh_token,
        })
        .then(({ error }) => {
          if (error) {
            console.error("Error setting recovery session:", error);
            goto("/login?error=invalid_recovery_link");
          } else {
            console.log("Recovery session set, redirecting to update-password");
            // Clear the hash and redirect
            window.location.hash = "";
            goto("/update-password");
          }
        });

      return; // Don't set up auth state change listener yet
    }

    // Normal auth state change handling
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((event, _session) => {
      invalidate("supabase:auth");
    });

    return () => subscription.unsubscribe();
  });
</script>

<div class="app">
  <nav class="nav">
    <div class="container nav-content">
      <a href="/" class="nav-logo">SKSB Auth</a>
      <div class="nav-links">
        <a href="/contact" class="btn btn-outline">Contact</a>
        <a href="/blog" class="btn btn-outline">Blog</a>
        {#if user}
          <a href="/demo/protected-full" class="btn btn-outline">Protected</a>
          <a href="/admin" class="btn btn-outline">Admin</a>
          <form action="/logout" method="POST">
            <button type="submit" class="btn btn-outline">Logout</button>
          </form>
        {:else}
          <a href="/login" class="btn btn-outline">Login</a>
          <a href="/signup" class="btn btn-primary">Sign Up</a>
        {/if}
      </div>
    </div>
  </nav>

  <main
    class="container"
    style="padding-top: var(--space-8); padding-bottom: var(--space-8);"
  >
    <slot />
  </main>
</div>
