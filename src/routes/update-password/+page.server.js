import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ locals: { safeGetSession } }) => {
  const { user } = await safeGetSession();
  if (!user) {
    throw redirect(303, '/login');
  }
};

export const actions = {
  default: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();
    const password = formData.get('password');

    if (!password) {
      return fail(400, { error: 'Password is required' });
    }

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      return fail(500, { error: error.message });
    }

    throw redirect(303, '/demo/protected-full');
  },
};
