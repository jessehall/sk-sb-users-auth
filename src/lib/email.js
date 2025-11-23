import { Resend } from 'resend';
import { RESEND_API_KEY } from '$env/static/private';

const resend = new Resend(RESEND_API_KEY);

export const sendPasswordResetEmail = async (email, link) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Jesse Hall <jesse@jessehall.com>',
      to: [email],
      subject: 'Reset your password',
      html: `<p>Click the link below to reset your password:</p><p><a href="${link}">${link}</a></p>`,
    });

    if (error) {
      console.error('Resend error:', error);
      return { error };
    }

    return { data };
  } catch (e) {
    console.error('Resend exception:', e);
    return { error: e };
  }
};

export const sendSignupCode = async (email, code) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Jesse Hall <jesse@jessehall.com>',
      to: [email],
      subject: 'Confirm your account',
      html: `<p>Your confirmation code is:</p><h2>${code}</h2><p>Enter this code to verify your account.</p>`,
    });

    if (error) {
      console.error('Resend error:', error);
      return { error };
    }

    return { data };
  } catch (e) {
    console.error('Resend exception:', e);
    return { error: e };
  }
};

export const sendWelcomeEmail = async (email, fullName) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Jesse Hall <jesse@jessehall.com>',
      to: [email],
      subject: 'Welcome to SKSB Auth!',
      html: `
        <h1>Welcome, ${fullName}!</h1>
        <p>Thank you for completing your profile. We're excited to have you on board.</p>
        <p>You now have full access to all features.</p>
        <p>If you have any questions, feel free to reach out.</p>
        <p>Best regards,<br>The SKSB Auth Team</p>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return { error };
    }

    return { data };
  } catch (e) {
    console.error('Resend exception:', e);
    return { error: e };
  }
};

export const sendContactEmails = async (name, email, message) => {
  try {
    // Admin notification
    const adminRes = await resend.emails.send({
      from: 'Jesse Hall <jesse@jessehall.com>',
      to: ['jesse@jessehall.com'],
      subject: 'New Contact Form Submission',
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
      reply_to: email
    });

    // User confirmation
    const userRes = await resend.emails.send({
      from: 'Jesse Hall <jesse@jessehall.com>',
      to: [email],
      subject: 'Thank you for contacting us',
      html: `
        <p>Hi ${name},</p>
        <p>Thanks for reaching out! We've received your message and will get back to you soon.</p>
        <p>Best regards,<br>The Team</p>
      `
    });

    if (adminRes.error || userRes.error) {
      console.error('Resend error:', adminRes.error || userRes.error);
      return { error: adminRes.error || userRes.error };
    }

    return { success: true };
  } catch (e) {
    console.error('Resend exception:', e);
    return { error: e };
  }
};
