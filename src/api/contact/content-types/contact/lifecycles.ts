export default {
  async afterCreate(event: any) {
    const { result } = event;

    // Prevent double emails if Draft & Publish is on
    if (result.publishedAt === null) return;

    try {
      await strapi.plugin('email').service('email').send({
        to: 'soun.savdanit@gmail.com',
        // ✅ STRAPI CLOUD FIX: Use no-reply or your verified cloud email
        from: 'no-reply@strapiapp.com', 
        replyTo: result.email, 
        subject: `Channes Noted : ${result.subject}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
            <h2 style="color: #0fc3b2;">New Contact Message</h2>
            <p><strong>From:</strong> ${result.fullName} (${result.email})</p>
            <p><strong>Subject:</strong> ${result.subject}</p>
            <hr style="border: none; border-top: 1px solid #eee;" />
            <p><strong>Message:</strong></p>
            <blockquote style="background: #f9f9f9; padding: 15px; border-left: 5px solid #0fc3b2; border-radius: 4px;">
              ${result.description}
            </blockquote>
          </div>
        `,
      });
      console.log('✅ Email alert sent via Strapi Cloud.');
    } catch (err) {
      // This is the Axios 422 error you saw in the logs
      console.error('❌ Email failed:', err.response?.data || err.message);
    }
  },
};