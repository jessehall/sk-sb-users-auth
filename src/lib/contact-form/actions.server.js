import { fail, redirect } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/server/supabase-admin';
import { sendContactEmails } from '$lib/email';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const contactFormAction = async ({ request }) => {
    const formData = await request.formData();
    const name = (formData.get('name') || '').toString().trim();
    const email = (formData.get('email') || '').toString().trim();
    const message = (formData.get('message') || '').toString().trim();

    const values = { name, email, message };
    const errors = {};
    
    if (!name) errors.name = 'Name is required.';
    if (!email) errors.email = 'Email is required.';
    else if (!emailRegex.test(email)) errors.email = 'Please enter a valid email address.';
    if (!message) errors.message = 'Message is required.';

    if (Object.keys(errors).length) {
      return fail(400, { message: 'Please fix the errors below.', errors, values });
    }

    // 1) Store in Supabase
    const { error: dbError } = await supabaseAdmin
      .from('contacts')
      .insert({ name, email, message });
    
    if (dbError) {
      console.error('Supabase insert error:', dbError);
      return fail(500, { 
        message: 'Unable to save your message right now. Please try again later.', 
        values 
      });
    }

    // 2) Send emails via Resend
    const { error: emailError } = await sendContactEmails(name, email, message);

    if (emailError) {
      console.error('Email sending failed but contact saved:', emailError);
      // We still redirect to confirmation if DB save was successful
    }

    throw redirect(303, '/confirmation');
};
