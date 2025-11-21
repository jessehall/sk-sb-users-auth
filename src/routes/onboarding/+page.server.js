import { fail, redirect } from '@sveltejs/kit';
import { sendWelcomeEmail } from '$lib/email';

export const load = async ({ locals: { safeGetSession, supabase } }) => {
  const { user } = await safeGetSession();

  if (!user) {
    throw redirect(303, '/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profile?.full_name && profile?.username) {
    throw redirect(303, '/demo/protected-full');
  }

  return { profile };
};

export const actions = {
  default: async ({ request, locals: { supabase, safeGetSession } }) => {
    const { user } = await safeGetSession();
    if (!user) {
      return fail(401, { error: 'Unauthorized' });
    }

    const formData = await request.formData();
    const fullName = formData.get('fullName');
    const username = formData.get('username');
    const website = formData.get('website');

    if (!fullName || !username) {
      return fail(400, { error: 'Full Name and Username are required' });
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        username,
        website,
        updated_at: new Date(),
      })
      .eq('id', user.id);

    if (error) {
      return fail(500, { error: error.message });
    }

    // Send welcome email after successful profile completion
    await sendWelcomeEmail(user.email, fullName);

    throw redirect(303, '/demo/protected-full');
  },
};
