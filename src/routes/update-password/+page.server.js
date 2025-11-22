import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ locals: { safeGetSession } }) => {
  // Check if user is logged in (they should be after coming from the reset link)
  const { user } = await safeGetSession();
  
  if (!user) {
    // If not logged in, redirect to login with a message
    throw redirect(303, '/login?message=Please click the reset link from your email');
  }

  return {};
};

export const actions = {
  default: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    if (!password) {
      return fail(400, { error: 'Password is required' });
    }

    if (password !== confirmPassword) {
      return fail(400, { error: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return fail(400, { error: 'Password must be at least 6 characters' });
    }

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      console.error('Error updating password:', error);
      return fail(500, { error: error.message });
    }

    console.log('Password updated successfully');
    return { success: true, message: 'Password updated successfully!' };
  },
};
