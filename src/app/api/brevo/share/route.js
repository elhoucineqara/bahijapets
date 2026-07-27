import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { product, productUrl } = await request.json();
    const baseUrl = productUrl ? new URL(productUrl).origin : 'https://BahijaPets.com';

    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL || "contact@yourstore.com";
    const listId = process.env.BREVO_LIST_ID;

    // If the user hasn't configured Brevo yet, return a mocked success with an explanatory message.
    if (!apiKey || apiKey === "your_brevo_api_key_here") {
      console.warn("Brevo API Key not configured. Simulating success.");
      // Simulated delay
      await new Promise(r => setTimeout(r, 1000));
      return NextResponse.json({ 
        success: true, 
        message: "Simulated success! To send real emails, please configure BREVO_API_KEY in .env.local" 
      });
    }

    const campaignData = {
      name: `Promo: ${product.title}`,
      sender: { name: "BahijaPets", email: senderEmail },
      subject: `🔥 New offer: ${product.title}`,
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #6366f1;">New arrival in our store!</h2>
          <img src="${product.image}" alt="${product.title}" style="width: 100%; max-width: 300px; border-radius: 8px; margin-bottom: 20px;" />
          <h3 style="font-size: 1.2rem; margin-bottom: 10px;">${product.title}</h3>
          <p style="font-size: 1rem; line-height: 1.5; color: #555;">${product.description}</p>
          <p style="font-size: 1.5rem; font-weight: bold; color: #10b981;">Price: $${product.price.toFixed(2)}</p>
          <div style="margin-top: 30px; text-align: center;">
            <a href="${product.affiliateUrl || productUrl}" style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 50px; font-weight: bold; margin-bottom: 15px; width: 80%; max-width: 250px; box-sizing: border-box; text-transform: uppercase; letter-spacing: 0.5px;">
              🛒 View Offer
            </a>
            <br/>
            <a href="${productUrl}" style="display: inline-block; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 50px; font-weight: bold; margin-bottom: 15px; width: 80%; max-width: 250px; box-sizing: border-box; text-transform: uppercase; letter-spacing: 0.5px;">
              🛍️ View on our store
            </a>
          </div>
          
          <div style="margin-top: 40px; text-align: center; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; margin-bottom: 15px;">Discover other interesting items:</p>
            <a href="${baseUrl}/products" style="display: inline-block; background-color: transparent; color: #4f46e5; border: 2px solid #4f46e5; padding: 12px 24px; text-decoration: none; border-radius: 50px; font-weight: bold;">
              ✨ More products
            </a>
          </div>
        </div>
      `,
      recipients: { listIds: listId ? [parseInt(listId)] : [] } // Replace with your list IDs if needed
    };

    const response = await fetch('https://api.brevo.com/v3/emailCampaigns', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify(campaignData)
    });

    if (!response.ok) {
      const errData = await response.json();
      console.error("Brevo API Error:", errData);
      throw new Error(errData.message || "Failed to create campaign in Brevo");
    }

    const data = await response.json();

    return NextResponse.json({ success: true, message: "Campaign created successfully!", data });
  } catch (error) {
    console.error("Brevo Share Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
