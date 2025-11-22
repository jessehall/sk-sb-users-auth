import { redirect } from '@sveltejs/kit';

export const GET = async ({ url, locals: { supabase } }) => {
  const code = url.searchParams.get('code');
  const next = url.searchParams.get('next') ?? '/onboarding';

  // Handle OAuth code exchange
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      throw redirect(303, next);
    }
  }

  // For password recovery, tokens come in the URL hash (client-side)
  // So we redirect to a client-side page that will handle them
  const type = url.searchParams.get('type');
  if (type === 'recovery') {
    throw redirect(303, '/auth/recovery');
  }

  // Return the user to an error page with instructions
  throw redirect(303, '/login?error=auth_code_error');
};
