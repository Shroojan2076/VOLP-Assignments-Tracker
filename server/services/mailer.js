import nodemailer from "nodemailer";
import { config } from "dotenv";

config();
 
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 465,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

function generateEmailHTML(studentName, assignments) {
    const listItems = assignments.map(a => {
        const dueDate = new Date(a.due_date).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
            timeZone: "Asia/Kolkata"
        });

        return `
            <div style="background: #f8fafc; border-left: 4px solid #6366f1; padding: 12px 16px; margin-bottom: 12px; border-radius: 4px;">
                <div style="font-size: 12px; color: #6366f1; font-weight: bold; text-transform: uppercase;">
                    ${a.course_code} • ${a.course_name}
                </div>
                <div style="font-size: 15px; font-weight: 600; color: #1e293b; margin: 4px 0;">
                    ${a.question.substring(0, 160)}${a.question.length > 160 ? "..." : ""}
                </div>
                <div style="font-size: 13px; color: #e11d48; font-weight: 500;">
                    ⏰ Due: <strong>${dueDate}</strong> (Marks: ${a.marks || 'N/A'})
                </div>
            </div>
        `;
    }).join("");

    return `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; color: #334155;">
            <h2 style="color: #1e293b; margin-bottom: 6px;">Upcoming Assignment Deadlines ⚠️</h2>
            <p style="font-size: 14px; color: #64748b; margin-top: 0;">Hello ${studentName || "Student"}, you have <strong>${assignments.length}</strong> pending assignment(s) due within the next 3 days on VOLP:</p>
            
            ${listItems}
            <p style="font-size: 12px; color: #94a3b8; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 12px;">
                Automated reminder from VOLP Tracker. Once you submit on classroom.volp.in and sync, completed assignments will stop appearing.
            </p>
        </div>
    `;
}

export async function sendUserReminder(studentEmail, studentName, assignments) {
    const htmlContent = generateEmailHTML(studentName, assignments);

    return transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.SMTP_USER,
        to: studentEmail,
        subject: `VOLP Reminder: ${assignments.length} Assignment(s) Due in Next 3 Days`,
        html: htmlContent
    });
}