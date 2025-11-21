import { fail, redirect } from '@sveltejs/kit';

export const actions = {
  default: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();
    const email = formData.get('email');
    const code = formData.get('code');

    if (!email || !code) {
      return fail(400, { error: 'Email and code are required' });
    }

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'signup',
    });

    if (error) {
      return fail(500, { error: error.message });
    }

    throw redirect(303, '/onboarding');
  },
};
