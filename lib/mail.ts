import nodemailer, { type Transporter } from "nodemailer";

let transporter: Transporter | undefined;

function getTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: process.env.ETHEREAL_USER!,
        pass: process.env.ETHEREAL_PASS!,
      },
    });
  }
  return transporter;
}

export async function sendEmail(to: string, subject: string, body: string): Promise<void> {
  await getTransporter().sendMail({
    from: `"Auth Demo" <${process.env.ETHEREAL_USER}>`,
    to,
    subject,
    text: body,
  });
}
