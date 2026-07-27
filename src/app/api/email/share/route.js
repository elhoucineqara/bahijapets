import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { product, productUrl, emails } = await request.json();
    const baseUrl = productUrl ? new URL(productUrl).origin : 'https://BahijaPets.com';

    if (!emails || emails.length === 0) {
      return NextResponse.json({ error: "No email addresses provided" }, { status: 400 });
    }

    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
      return NextResponse.json({ error: "SMTP configuration is missing in .env.local" }, { status: 500 });
    }

    // Create a transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    const productFeatures = (product.features && product.features.length > 0) 
      ? `<ul style="list-style: none; padding: 0; margin: 20px 0;">` + product.features.slice(0, 3).map(f => `<li style="margin-bottom: 8px; color: #475569; font-size: 0.95rem;">✅ ${f}</li>`).join('') + `</ul>`
      : '';

    const subjects = [
      `🔥 New offer: ${product.title}`,
      `🐾 We found something special for you: ${product.title}`,
      `⭐ Top Deal of the Day: ${product.title}`,
      `🎁 Check out this amazing product: ${product.title}`,
      `💡 You won't want to miss this: ${product.title}`
    ];
    
    const subtitles = [
      `🔥 Our exclusive daily pick`,
      `💖 Specially selected for your pet`,
      `🚀 Don't miss out on this deal`,
      `🌟 Highlight of the week`
    ];

    const ctaPrimary = [
      `🛒 View Offer`,
      `👉 Grab the Deal`,
      `🔥 Get it Now`,
      `🎁 Claim This Offer`
    ];
    
    const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
    const randomSubtitle = subtitles[Math.floor(Math.random() * subtitles.length)];
    const randomCTA = ctaPrimary[Math.floor(Math.random() * ctaPrimary.length)];

    const htmlContent = `
      <div style="font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 15px 35px rgba(0,0,0,0.08); border: 1px solid #fce7f3;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); padding: 35px 20px; text-align: center; border-bottom: 4px solid #fbcfe8;">
          <h1 style="color: #ffffff; margin: 0; font-size: 2.2rem; font-weight: 900; letter-spacing: 1px; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">🐾 BahijaPets</h1>
          <p style="color: #fdf4ff; margin: 12px 0 0 0; font-size: 1.15rem; font-weight: 500;">${randomSubtitle}</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 45px 35px;">
          <!-- Product Image -->
          <div style="text-align: center; margin-bottom: 35px; position: relative;">
            <div style="display: inline-block; padding: 15px; background: #ffffff; border-radius: 20px; box-shadow: 0 10px 25px rgba(236, 72, 153, 0.15); border: 2px solid #fbcfe8;">
              <img src="${product.image}" alt="${product.title}" style="width: 100%; max-width: 280px; border-radius: 12px; display: block;" />
            </div>
          </div>
          
          <!-- Product Title -->
          <h2 style="font-size: 1.5rem; margin: 0 0 15px 0; color: #1e293b; line-height: 1.4; font-weight: 800; text-align: center;">${product.title}</h2>
          
          <!-- Product Description -->
          <p style="font-size: 1.05rem; line-height: 1.6; color: #475569; margin-bottom: 25px; text-align: center;">
            ${product.description.substring(0, 250)}${product.description.length > 250 ? '...' : ''}
          </p>

          <!-- Features (if any) -->
          ${productFeatures}
          
          <!-- Price Card -->
          <div style="margin: 35px 0; text-align: center; padding: 25px; background: linear-gradient(to right, #fff1f2, #fdf4ff); border-radius: 16px; border-left: 6px solid #ec4899; box-shadow: inset 0 2px 10px rgba(236, 72, 153, 0.05);">
            <span style="display: block; font-size: 1rem; color: #db2777; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700; margin-bottom: 8px;">Special Price</span>
            <span style="display: block; font-size: 2.8rem; font-weight: 900; color: #1e293b; text-shadow: 1px 1px 0px rgba(255,255,255,0.5);">$${product.price.toFixed(2)}</span>
          </div>

          <!-- CTA Buttons -->
          <div style="text-align: center; margin-top: 40px;">
            <div style="margin-bottom: 18px;">
              <a href="${product.affiliateUrl || productUrl}" style="display: inline-block; background: linear-gradient(135deg, #f43f5e 0%, #fb923c 100%); color: #ffffff; padding: 18px 40px; text-decoration: none; border-radius: 50px; font-weight: 800; font-size: 1.2rem; box-shadow: 0 8px 20px rgba(244, 63, 94, 0.3); text-transform: uppercase; letter-spacing: 1px; width: 85%; max-width: 320px; box-sizing: border-box; transition: transform 0.2s;">
                ${randomCTA}
              </a>
            </div>
            <div>
              <a href="${productUrl}" style="display: inline-block; background: #f8fafc; color: #64748b; padding: 16px 36px; text-decoration: none; border-radius: 50px; font-weight: 700; font-size: 1.05rem; border: 2px solid #e2e8f0; text-transform: uppercase; letter-spacing: 0.5px; width: 85%; max-width: 320px; box-sizing: border-box;">
                🛍️ View on our store
              </a>
            </div>
          </div>

          <!-- More Products -->
          <div style="text-align: center; margin-top: 45px; padding-top: 35px; border-top: 2px dashed #f1f5f9;">
            <p style="color: #64748b; font-size: 1.05rem; margin-bottom: 20px; font-weight: 500;">Want to discover more great deals for your pet?</p>
            <a href="${baseUrl}/products" style="display: inline-block; background-color: transparent; color: #8b5cf6; border: 2px solid #8b5cf6; padding: 12px 35px; text-decoration: none; border-radius: 50px; font-weight: 800; font-size: 1.05rem;">
              ✨ Explore More Products
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 25px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0; color: #94a3b8; font-size: 0.9rem; line-height: 1.5;">
            You received this email because you are subscribed to our newsletter.<br/>
            Made with ❤️ for pets and their owners.<br/>
            &copy; ${new Date().getFullYear()} BahijaPets. All rights reserved.
          </p>
        </div>
      </div>
    `;

    // Send emails
    const info = await transporter.sendMail({
      from: `"BahijaPets" <${SMTP_FROM || SMTP_USER}>`, 
      to: SMTP_FROM || SMTP_USER, // Send to self
      bcc: emails.join(', '),     // BCC everyone else to hide their addresses
      subject: randomSubject, 
      html: htmlContent, 
    });

    console.log("Message sent: %s", info.messageId);

    return NextResponse.json({ success: true, message: "Emails sent successfully!" });
  } catch (error) {
    console.error("Email Share Error:", error);
    return NextResponse.json({ error: error.message || "Failed to send email" }, { status: 500 });
  }
}
