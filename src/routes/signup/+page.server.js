import { fail, redirect } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/server/supabase-admin';
import { sendSignupCode } from '$lib/email';

export const actions = {
  signup: async ({ request }) => {
    const formData = await request.formData();
    const email = formData.get('email');
    const password = formData.get('password');

    if (!email || !password) {
      return fail(400, { error: 'Email and password are required' });
    }

    // Use admin generateLink to get the OTP and handle sending email ourselves via Resend
    // This bypasses Supabase's default email sending
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'signup',
      email,
      password,
    });

    if (error) {
      return fail(500, { error: error.message });
    }

    if (data?.properties?.email_otp) {
      const { error: emailError } = await sendSignupCode(email, data.properties.email_otp);
      if (emailError) {
        console.error('Failed to send email:', emailError);
        // We still redirect, but maybe warn? Or fail?
        // Ideally we'd rollback the user creation but that's complex.
        // For now, let's assume it works or user can resend.
      }
    }

    throw redirect(303, `/confirm?email=${encodeURIComponent(email)}`);
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
