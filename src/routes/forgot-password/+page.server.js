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

    // Generate password recovery link
    // Note: The actual domain of the link is controlled by Supabase's Site URL setting
    // The redirectTo is where the user goes after Supabase processes the tokens
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: {
        redirectTo: `${url.origin}/update-password`,
      },
    });

    if (error) {
      console.error('Error generating reset link:', error);
      return fail(500, { error: error.message });
    }

    // The action_link contains the recovery tokens in the URL hash
    // Format: https://[supabase-site-url]/#access_token=...&refresh_token=...&type=recovery
    const resetLink = data.properties.action_link;

    console.log('Generated reset link:', resetLink);
    console.log('Note: Link will use Supabase Site URL from dashboard settings');

    // Send email with the link
    const { error: emailError } = await sendPasswordResetEmail(email, resetLink);

    if (emailError) {
      console.error('Email error:', emailError);
      return fail(500, { error: 'Failed to send email' });
    }

    return { success: true, message: 'Check your email for the reset link.' };
  },
};
