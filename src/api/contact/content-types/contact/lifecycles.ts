export default {
  async afterCreate(event: any) {
    const { result } = event;

    // 1. ✅ PREVENT DOUBLE EMAIL: Only send if the entry is published
    // If you have "Draft & Publish" enabled, this ensures only one email is sent.
    if (result.publishedAt === null) return;

    console.log('New Contact Alert created for:', result.fullName);

    try {
      // 2. ✅ AUTHENTICATE: Use your verified Gmail for both 'to' and 'from'
      await strapi.plugin('email').service('email').send({
        to: 'soun.savdanit@gmail.com', 
        from: 'soun.savdanit@gmail.com', // Must match your GMAIL_USER in .env
        replyTo: result.email, // Allows you to reply directly to the sender
        subject: `${result.subject}`,
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
      console.log('✅ Email alert sent to Gmail successfully.');
    } catch (err) {
      // 3. ✅ ERROR HANDLING: Prevents your Vue app from crashing
      console.error('❌ Email failed to send, but data is safe in DB:', err);
    }
  },
};