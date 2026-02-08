import nodemailer from "nodemailer";

const host = process.env.SMTP_HOST || "smtp.gmail.com";
const port = parseInt(process.env.SMTP_PORT, 10) || 587;
const secure = process.env.SMTP_SECURE === "true";
const user = process.env.MAIL_ID;
const pass = process.env.MAIL_PASSWORD;

/**
 * Creates a nodemailer transporter when MAIL_ID and MAIL_PASSWORD are set (e.g. in .env).
 * Uses Gmail SMTP by default: smtp.gmail.com, port 587, secure: false.
 * @returns {import('nodemailer').Transporter | null}
 */
export function createMailTransporter() {
    if (!user || !pass) return null;
    return nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass },
    });
}

/**
 * Sends a password reset email to the given address with the reset link.
 * @param {string} to - Recipient email
 * @param {string} resetUrl - Full URL for password reset (e.g. frontend/reset-password/:token)
 * @returns {Promise<{ success: boolean, error?: Error }>}
 */
export async function sendPasswordResetEmail(to, resetUrl) {
    const transporter = createMailTransporter();
    if (!transporter) {
        return { success: false, error: new Error("Mail not configured (MAIL_ID / MAIL_PASSWORD)") };
    }
    try {
        await transporter.sendMail({
            from: process.env.MAIL_ID,
            to,
            subject: "DocVault – Reset your password",
            text: `Use this link to reset your password (valid for 1 hour):\n\n${resetUrl}`,
            html: `
        <p>You requested a password reset for your DocVault account.</p>
        <p><a href="${resetUrl}">Reset your password</a></p>
        <p>This link expires in 1 hour. If you didn't request this, you can ignore this email.</p>
      `.trim(),
        });
        return { success: true };
    } catch (err) {
        return { success: false, error: err };
    }
}
