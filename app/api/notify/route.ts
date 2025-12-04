import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email, name, content } = await req.json();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Gmail
        pass: process.env.EMAIL_PASS, // App password
      },
    });

    await transporter.sendMail({
      from: `"Event Hall" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Танд мэдэгдэл ирлээ",
      html: `
        <p>Сайн байна уу, ${name}?</p>
        <p>${content}</p>
      `,
    });

    return Response.json({ success: true, message: "Email илгээлээ!" });
  } catch (error) {
    console.error("Email error:", error);
    return Response.json(
      { success: false, message: "Email илгээж чадсангүй" },
      { status: 500 }
    );
  }
}
