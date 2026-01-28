import type { APIRoute } from "astro";
import nodemailer from "nodemailer";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    if (import.meta.env.MODE !== "development") {
        return new Response(JSON.stringify({ error: "Only available in dev" }), { status: 404 });
    }
    const data = await request.json();
    const { name, mail, subject, content } = data;

    if (!name || !mail || !subject || !content) {
        return new Response(JSON.stringify({ error: "Champs manquants" }), { status: 400 });
    }

    const transporter = nodemailer.createTransport({
        host: import.meta.env.SMTP_HOST,
        port: 587,
        secure: false,
        auth: {
            user: import.meta.env.SMTP_USER,
            pass: import.meta.env.SMTP_PASS,
        },
    });

    await transporter.sendMail({
        from: `"${name}" <${mail}>`,
        to: "brian.baur.pro@gmail.com", //"ace@ace-transport.com",
        subject,
        text: content,
    });

    return new Response(JSON.stringify({ success: true }));
};