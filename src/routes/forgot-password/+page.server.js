import { fail } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/server/supabase-admin';
import { sendPasswordResetEmail } from '$lib/email';

export const actions = {
  default: async ({ request, url }) => {
    const formData = await request.formData();
    const email = formData.get('email');

    if (!email) {
      return fail(400, { error: 'Email is required' });
    }

    // Generate link
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: {
        redirectTo: `${url.origin}/update-password`,
      },
    });

    if (error) {
      return fail(500, { error: error.message });
    }

    // Send email
    const { error: emailError } = await sendPasswordResetEmail(email, data.properties.action_link);

    if (emailError) {
      console.error('Email error:', emailError);
      return fail(500, { error: 'Failed to send email' });
    }

    return { success: true, message: 'Check your email for the reset link.' };
  },
};
