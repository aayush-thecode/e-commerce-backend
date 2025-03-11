import nodemailer from 'nodemailer'


const transporter = nodemailer.createTransport({
    host: process.env.SMTP_SERVER,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_PORT === '465', // true for port 465, false for other ports
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });


interface IMailOptions {
    to: string;
    subject: string;
    text: string;
}

export const sendEmail = async (mailOptions: IMailOptions) => {

    const mailOption = {
        to:mailOptions.to,
        from: `'${process.env.MAIL_FROM}' <${process.env.SNTP_EMAIL}>`, // sender address
        subject: mailOptions.subject,
        text:mailOptions.text
    }

    await transporter.sendMail(mailOption);
}