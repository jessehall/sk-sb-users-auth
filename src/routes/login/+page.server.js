import { fail, redirect } from '@sveltejs/kit';

export const actions = {
  login: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();
    const email = formData.get('email');
    const password = formData.get('password');

    if (!email || !password) {
      return fail(400, { error: 'Email and password are required' });
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return fail(500, { error: error.message });
    }

    throw redirect(303, '/demo/protected-full');
  },

  loginWithGoogle: async ({ locals: { supabase }, url }) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${url.origin}/auth/callback`,
      },
    });

    if (error) {
      return fail(500, { error: error.message });
    }

    if (data.url) {
      throw redirect(303, data.url);
    }
  },
};
