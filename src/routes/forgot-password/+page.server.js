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

    // Check if user exists and what auth provider they use
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) {
      console.error('Error listing users:', listError);
      // Don't reveal if user exists or not for security
      return { success: true, message: 'If an account exists with this email, you will receive a reset link.' };
    }

    const user = users.find(u => u.email === email);

    if (!user) {
      // Don't reveal if user exists or not for security
      return { success: true, message: 'If an account exists with this email, you will receive a reset link.' };
    }

    // Check auth providers
    const providers = user.app_metadata?.providers || [];
    const hasEmailAuth = providers.includes('email');
    const hasGoogleAuth = providers.includes('google');

    // Only block if user ONLY has Google (no email/password)
    if (hasGoogleAuth && !hasEmailAuth) {
      return fail(400, { 
        error: 'This email is associated with a Google account only. Please sign in with Google instead.',
        isGoogleAccount: true
      });
    }

    // User has email/password auth (with or without Google)
    // Generate password recovery link that redirects to /auth/recovery
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: {
        // This is where user goes AFTER clicking the link and Supabase processes it
        redirectTo: `${url.origin}/auth/recovery`,
      },
    });

    if (error) {
      console.error('Error generating reset link:', error);
      return fail(500, { error: 'Failed to generate reset link. Please try again.' });
    }

    // The action_link contains the recovery tokens
    // It will be in format: https://[site-url]/#access_token=...&type=recovery
    // But Supabase will redirect to our redirectTo URL with the tokens
    const resetLink = data.properties.action_link;

    console.log('Generated reset link:', resetLink);

    // Send email with the link
    const { error: emailError } = await sendPasswordResetEmail(email, resetLink);

    if (emailError) {
      console.error('Email error:', emailError);
      return fail(500, { error: 'Failed to send email. Please try again.' });
    }

    return { success: true, message: 'Check your email for the reset link.' };
  },
};
