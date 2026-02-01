import nodemailer from 'nodemailer';
import logger from '../utils/logger';

// Create transporter - for development, we'll use a test account or console logging
// For production, configure with real SMTP credentials
const createTransporter = () => {
    // Check if email credentials are configured
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    // For development without SMTP, log to console
    return null;
};

const transporter = createTransporter();

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
}

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
    try {
        if (!transporter) {
            // Development mode - log email to console
            logger.info('📧 [DEV MODE] Email would be sent:');
            logger.info(`   To: ${options.to}`);
            logger.info(`   Subject: ${options.subject}`);
            logger.info(`   Content: ${options.text || 'See HTML'}`);
            return true;
        }

        const mailOptions = {
            from: process.env.SMTP_FROM || 'WineMate <noreply@winemate.app>',
            to: options.to,
            subject: options.subject,
            html: options.html,
            text: options.text,
        };

        await transporter.sendMail(mailOptions);
        logger.info(`📧 Email sent to ${options.to}`);
        return true;
    } catch (error) {
        logger.error('Error sending email:', error);
        return false;
    }
};

export const sendPasswordResetEmail = async (
    email: string,
    resetToken: string,
    resetUrl: string
): Promise<boolean> => {
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #8B2635; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
                .button { display: inline-block; background: #8B2635; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
                .code { background: #eee; padding: 15px; font-size: 24px; text-align: center; letter-spacing: 5px; font-weight: bold; border-radius: 8px; }
                .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🍷 WineMate</h1>
                </div>
                <div class="content">
                    <h2>Reset Your Password</h2>
                    <p>We received a request to reset your password. Use the code below to reset it:</p>

                    <div class="code">${resetToken}</div>

                    <p>Or click the button below:</p>
                    <a href="${resetUrl}" class="button">Reset Password</a>

                    <p><strong>This code expires in 1 hour.</strong></p>

                    <p>If you didn't request this, you can safely ignore this email.</p>
                </div>
                <div class="footer">
                    <p>© ${new Date().getFullYear()} WineMate. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;

    const text = `
        WineMate - Password Reset

        We received a request to reset your password.

        Your reset code: ${resetToken}

        Or visit: ${resetUrl}

        This code expires in 1 hour.

        If you didn't request this, you can safely ignore this email.
    `;

    return sendEmail({
        to: email,
        subject: 'Reset Your WineMate Password',
        html,
        text,
    });
};

export default {
    sendEmail,
    sendPasswordResetEmail,
};
