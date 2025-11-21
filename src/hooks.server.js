import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const handle = async ({ event, resolve }) => {
  event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => event.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) => {
          event.cookies.set(name, value, { ...options, path: '/' });
        });
      },
    },
  });

  /**
   * Helper to get the session safely.
   * We use getUser() to validate the auth token, which is the recommended way
   * to secure server-side routes. We don't call getSession() on the server
   * to avoid the security warning.
   */
  event.locals.safeGetSession = async () => {
    const {
      data: { user },
      error,
    } = await event.locals.supabase.auth.getUser();
    
    if (error || !user) {
      return { session: null, user: null };
    }

    // Return user only - client will handle session via its own supabase client
    return { session: null, user };
  };

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-range' || name === 'x-supabase-api-version';
    },
  });
};
