
import { NextResponse } from 'next/server';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const sesClient = new SESClient({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export async function POST(request: Request) {
    try {
        const { name, email, subject, message } = await request.json();

        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // HTML email content
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #0070f3;">New Contact Form Submission</h2>
                <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 10px;">
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Subject:</strong> ${subject || 'No Subject'}</p>
                    <hr style="border: 1px solid #ddd; margin: 15px 0;" />
                    <p style="white-space: pre-wrap;">${message}</p>
                </div>
            </div>
        `;

        const command = new SendEmailCommand({
            Source: process.env.FROM_EMAIL, // must be verified in SES
            Destination: {
                ToAddresses: [process.env.TO_EMAIL || process.env.FROM_EMAIL!],
            },
            Message: {
                Subject: {
                    Data: `Contact Form: ${subject || 'New Message'}`,
                },
                Body: {
                    Html: {
                        Data: htmlContent,
                    },
                    Text: {
                        Data: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
                    },
                },
            },
            ReplyToAddresses: [email],
        });

        await sesClient.send(command);

        return NextResponse.json({ message: 'Email sent successfully' });

    } catch (error: any) {
        console.error('Error sending email:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to send email' },
            { status: 500 }
        );
    }
}
