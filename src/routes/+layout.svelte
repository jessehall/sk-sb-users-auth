<script>
  import "../styles/global.css";
  import { invalidate } from "$app/navigation";
  import { onMount } from "svelte";
  import { createBrowserClient } from "@supabase/ssr";
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
