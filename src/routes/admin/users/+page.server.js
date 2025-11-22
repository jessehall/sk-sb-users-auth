import { fail } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/server/supabase-admin';
import { sendPasswordResetEmail } from '$lib/email';

export const load = async ({ locals: { supabase } }) => {
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching profiles:', error);
    return { profiles: [] };
  }

  return { profiles };
};

export const actions = {
  resetPassword: async ({ request, locals: { safeGetSession, supabase } }) => {
    // Check admin again just in case
    const { user } = await safeGetSession();
    if (!user) return fail(401);
    
    const { data: adminProfile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (adminProfile?.role !== 'admin') return fail(403);

    const formData = await request.formData();
    const email = formData.get('email');

    if (!email) return fail(400, { error: 'Email required' });

    // Generate link
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email,
    });

    if (error) {
      return fail(500, { error: error.message });
    }

    // Send email
    const { error: emailError } = await sendPasswordResetEmail(email, data.properties.action_link);

    if (emailError) {
      return fail(500, { error: 'Failed to send email' });
    }

    return { success: true, message: 'Password reset email sent' };
  },

  deleteUser: async ({ request, locals: { safeGetSession, supabase } }) => {
    // Check admin authorization
    const { user } = await safeGetSession();
    if (!user) return fail(401);
    
    const { data: adminProfile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (adminProfile?.role !== 'admin') return fail(403);

    const formData = await request.formData();
    const userId = formData.get('userId');

    if (!userId) return fail(400, { error: 'User ID required' });

    // Prevent admin from deleting themselves
    if (userId === user.id) {
      return fail(400, { error: 'You cannot delete your own account' });
    }

    // Delete user from auth (this will cascade delete the profile due to FK constraint)
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (error) {
      console.error('Error deleting user:', error);
      return fail(500, { error: error.message });
    }

    return { success: true, message: 'User deleted successfully' };
  },
};
