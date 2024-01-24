// emailService.ts

import nodemailer from 'nodemailer';

function createTransporter() {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'localhost',
        port: process.env.SMTP_PORT || 25,
        secure: false, // Set to true if your SMTP server requires secure connection
        auth: {
            user: process.env.SMTP_USERNAME || 'svdbuser',
            pass: process.env.SMTP_PASSWORD || 'WnS9IWjH# ',
        },
    });
}

async function sendErrorEmail(error: Error, jobName: string) {
    return new Promise((resolve, reject) => {
        const transporter = createTransporter();

        // Email content
        const mailOptions: nodemailer.SendMailOptions = {
            from: 'error@svdb.ddns.net',  // Replace with your email address
            to: 'santiagocasablanca@gmail.com',     // Replace with the recipient's email address
            subject: `Error in ${jobName} job`,
            text: `An error occurred while executing the ${jobName} job:\n\n${error.stack}`
        };

        // Send the email
        console.log('preparing to send email');
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error('Error sending email:', err);
                reject(err);
            } else {
                console.log('Email sent:', info.response);
                resolve(true);
            }
        });
    });
}

export { sendErrorEmail };
