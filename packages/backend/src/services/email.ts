import { Resend } from 'resend';

// Lazy init to avoid crashing at build time when env vars are absent
function getResend() {
    return new Resend(process.env.RESEND_API_KEY);
}
const FROM_EMAIL = process.env.NODE_ENV === 'production'
    ? 'BrandMindAI <noreply@brandmind.ai>'
    : 'BrandMindAI <onboarding@resend.dev>';

const APP_URL = process.env.SHOPIFY_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';

export async function sendVerificationEmail(email: string, name: string, token: string) {
    const verificationUrl = `${APP_URL}/api/auth/verify?token=${token}`;

    try {
        await getResend().emails.send({
            from: FROM_EMAIL,
            to: email,
            subject: 'Verify your BrandMindAI account',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #F59E0B;">BrandMindAI</h1>
                    <p>Hi ${name || 'there'},</p>
                    <p>Welcome to BrandMindAI! Please verify your email address to get started.</p>
                    <div style="margin: 32px 0;">
                        <a href="${verificationUrl}" style="background-color: #F59E0B; color: black; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Verify Email Address</a>
                    </div>
                    <p style="color: #64748b; font-size: 14px;">If you didn't create an account, you can safely ignore this email.</p>
                </div>
            `,
        });
        return { success: true };
    } catch (error) {
        console.error('[Email Service] Failed to send verification email:', error);
        return { success: false, error };
    }
}

export async function sendPasswordResetEmail(email: string, name: string, token: string) {
    const resetUrl = `${APP_URL}/auth/reset-password?token=${token}`;

    try {
        await getResend().emails.send({
            from: FROM_EMAIL,
            to: email,
            subject: 'Reset your BrandMindAI password',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #F59E0B;">BrandMindAI</h1>
                    <p>Hi ${name || 'there'},</p>
                    <p>We received a request to reset your password. Click the link below to choose a new one.</p>
                    <div style="margin: 32px 0;">
                        <a href="${resetUrl}" style="background-color: #F59E0B; color: black; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Reset Password</a>
                    </div>
                    <p style="color: #64748b; font-size: 14px;">This link will expire in 1 hour. If you didn't request a reset, please ignore this email.</p>
                </div>
            `,
        });
        return { success: true };
    } catch (error) {
        console.error('[Email Service] Failed to send reset email:', error);
        return { success: false, error };
    }
}
