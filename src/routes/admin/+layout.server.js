import { redirect } from '@sveltejs/kit';

export const load = async ({ locals: { safeGetSession, supabase } }) => {
  const { user } = await safeGetSession();

  if (!user) {
    throw redirect(303, '/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    throw redirect(303, '/');
  }

  return {
    user,
    isAdmin: true,
  };
};
