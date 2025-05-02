export const confirmAccount = (CONFIRM_LINK: string) => {
  return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8" />
        <title>LinkStore</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table align="center" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 40px 0;">
        <tr>
            <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                <!-- Header -->
                <tr>
                <td align="center" style="background-color: #4a90e2; padding: 20px;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 24px;">Linktree</h1>
                </td>
                </tr>

                <!-- Body -->
                <tr>
                <td style="padding: 30px;">
                    <h2 style="color: #333333; font-size: 20px;">Confirm your email address</h2>
                    <p style="color: #666666; font-size: 16px; line-height: 1.5;">
                    Thank you for signing up with <strong>Linkstore</strong>! Please confirm your email address to activate your account and start sharing your personal link collection.
                    </p>
                    <div style="text-align: center; margin: 30px 0;">
                    <a
                        href="${CONFIRM_LINK}"
                        style="
                        display: inline-block;
                        padding: 12px 24px;
                        font-size: 16px;
                        color: #ffffff;
                        background-color: #4a90e2;
                        border-radius: 5px;
                        text-decoration: none;
                        "
                        target="_blank"
                    >
                        Confirm Account
                    </a>
                    </div>
                    <p style="color: #999999; font-size: 14px;">
                    If you did not create an account, no further action is required.
                    </p>
                </td>
                </tr>

                <!-- Footer -->
                <tr>
                <td align="center" style="background-color: #f0f0f0; padding: 20px; font-size: 12px; color: #999999;">
                    &copy; 2025 Linkstore. All rights reserved.<br />
                </td>
                </tr>
            </table>
            </td>
        </tr>
        </table>
    </body>
    </html>
`;
};
