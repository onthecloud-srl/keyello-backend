import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

interface SendEmailOptions {
    to: string;
    subject: string;
    html: string;
}

export const sendEmail = async ({ to, subject, html }: SendEmailOptions): Promise<void> => {
    await transporter.sendMail({
        from: `${process.env.SMTP_FROM}`,
        to,
        subject,
        html,
    });
};

interface Replacements {
    [key: string]: string | undefined | null | number;
}

export function getEmailHtml(
    template: string,
    replacements: Replacements
): string {
    let emailHtml = template;

    for (let [key, value] of Object.entries(replacements)) {
        if (
            value !== undefined &&
            value !== null &&
            emailHtml.includes(`{${key}}`)
        ) {
            emailHtml = emailHtml.replace(new RegExp(`{${key}}`, "g"), String(value));
        }
    }

    return emailHtml;
}