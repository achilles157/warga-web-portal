import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getAdminsAndStaffEmails } from "@/lib/services/userService";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { articleId, articleTitle, authorName, status } = body;

        // Check if status is pending_review
        if (status !== "pending_review") {
            return NextResponse.json({ message: "No email needed" }, { status: 200 });
        }

        // Get recipients
        const emails = await getAdminsAndStaffEmails();
        
        if (!emails || emails.length === 0) {
            return NextResponse.json({ message: "No admin/staff emails found" }, { status: 404 });
        }

        // Setup Nodemailer transporter
        // Menggunakan Email: bungwarga@gmail.com
        // Pastikan menyimpan SMTP_PASSWORD di .env.local
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_EMAIL || 'bungwarga@gmail.com',
                pass: process.env.SMTP_PASSWORD
            }
        });

        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://wargadaily.vercel.app";
        const editorUrl = `${appUrl}/dashboard/articles/${articleId}`;

        // Send Email
        const mailOptions = {
            from: `"Warga Web Portal" <${process.env.SMTP_EMAIL || 'bungwarga@gmail.com'}>`,
            to: emails.join(", "),
            subject: `[Review Request] Artikel Baru: ${articleTitle}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Permintaan Review Artikel</h2>
                    <p>Halo Tim Redaksi,</p>
                    <p>Terdapat artikel baru yang diajukan untuk proses ditinjau (<strong>Pending Review</strong>) oleh <strong>${authorName || 'Contributor'}</strong>.</p>
                    
                    <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #3b82f6; margin: 20px 0;">
                        <h3 style="margin-top: 0; margin-bottom: 8px;">${articleTitle}</h3>
                        <p style="margin: 0; color: #555; font-size: 14px;">ID: ${articleId}</p>
                    </div>

                    <p>Silakan klik tombol di bawah ini untuk membuka dan meninjau artikel tersebut untuk menentukan apakah layak di publikasikan.</p>
                    
                    <div style="margin-top: 30px; margin-bottom: 30px;">
                        <a href="${editorUrl}" style="background-color: #111827; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Review Artikel Sekarang</a>
                    </div>
                    
                    <p style="color: #888; font-size: 12px; border-top: 1px solid #eee; padding-top: 15px;">
                        Email ini dikirim otomatis oleh sistem Warga Web Portal. Harap tidak membalas email ini.
                    </p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true, message: "Email notification sent" });
    } catch (error: any) {
        console.error("Error sending notification email:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
