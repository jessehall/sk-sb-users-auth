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
