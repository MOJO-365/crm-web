/**
* Generate welcome email for NEW customers (no previous account)
* Simpler format without PDFs
*/
export const generateNewCustomerEmailHtml = (customer: Customer, config: EmailTemplateConfig, verificationCode?:
string): string => {
const firstName = customer.firstName || 'Valued Customer';
const lastName = customer.lastName || '';
const fullName = `${firstName} ${lastName}`.trim();
const supportEmail = config.supportEmail || 'support@geeenergy.com.au';
const supportPhone = config.supportPhone || '1300 707 042';
const offerLink = config.offerLink || '#';

return `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Action Required: Please Review and Sign Your GEE Energy Offer</title>
</head>

<body
    style="margin: 0; padding: 20px; font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 1.6; color: #333333; background-color: #ffffff;">
    <div style="max-width: 600px;">
        <p style="margin: 0 0 15px;">Dear ${fullName},</p>

        <p style="margin: 0 0 15px;">We are pleased to provide you with your GEE Energy Offer. To complete the process,
            please review and electronically sign your agreement using the secure link below:</p>

        <p style="margin: 0 0 20px;">
            <a href="${offerLink}"
                style="display: inline-block; background-color: #5c8a14; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 15px;">Review
                and Sign Your Offer</a>
        </p>

        ${verificationCode ? `<div style="margin: 20px 0; text-align: left;">
            <div
                style="display: inline-block; padding: 12px 24px; background-color: #f7f9fc; border: 1px solid #e2e8f0; border-radius: 8px;">
                <p
                    style="margin: 0 0 4px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; font-weight: 600;">
                    Offer Access Code</p>
                <p
                    style="margin: 0; font-size: 20px; font-weight: 700; color: #5c8a14; letter-spacing: 2px; font-family: monospace;">
                    ${verificationCode}</p>
            </div>
        </div>` : ''}

        <p style="margin: 0 0 10px;"><strong>Important Information:</strong></p>

        <ul style="margin: 0 0 15px; padding-left: 25px;">
            <li style="margin-bottom: 5px;">This link is unique to your account and should not be shared.</li>
            <li style="margin-bottom: 5px;">Please review the Energy Supply Agreement, including your rates, terms, and
                conditions, before signing.</li>
            <li style="margin-bottom: 5px;">Once signed, your energy supply transfer will be initiated according to the
                agreed schedule.</li>
        </ul>

        <p style="margin: 0 0 15px;">If you have any questions or require assistance while reviewing the offer, please
            contact our Customer Care team on <a href="tel:${supportPhone}" style="color: #0066cc;">${supportPhone}</a>
            or email <a href="mailto:${supportEmail}" style="color: #0066cc;">${supportEmail}</a>.</p>

        <p style="margin: 0 0 15px;">We appreciate your prompt attention to this matter and thank you for choosing GEE
            Energy.</p>

        <p style="margin: 0 0 5px;">Kind regards,</p>
        <p style="margin: 0 0 10px;">GEE Energy Customer Care</p>
    </div>
</body>

</html>
`;
};

export const generateReminderEmailHtml = (customer: Customer, config: EmailTemplateConfig, verificationCode?: string):
string => {
const firstName = customer.firstName || 'Valued Customer';
const lastName = customer.lastName || '';
const fullName = `${firstName} ${lastName}`.trim();
const offerLink = config.offerLink || '#';

return `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reminder: Please sign your GEE Energy offer</title>
</head>

<body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, Helvetica, sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f4; padding:24px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" border="0"
                    style="max-width:600px; width:100%; background:#ffffff; border-radius:4px; overflow:hidden;">

                    <!-- HEADER -->
                    <tr>
                        <td style="padding:24px 32px 16px;">

                            <!-- Logo -->
                            <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
                                <tr>
                                    <td>
                                        <img src="https://go.gsync.com.au/main-logo-dark%206.png" alt="GEE Energy"
                                            height="36" style="display:block; border:0;" />
                                    </td>
                                </tr>
                            </table>

                            <p style="margin:0 0 8px; font-size:14px; color:#333;">Hi ${fullName},</p>
                            <h1 style="margin:0 0 16px; font-size:24px; font-weight:600; color:#111; line-height:1.2;">
                                Just a friendly reminder<br>about your offer.</h1>
                            <p style="margin:0 0 24px; font-size:14px; color:#444; line-height:1.6;">We recently shared
                                your GEE Energy offer. This is a friendly reminder to review the details and sign so we
                                can get you onboarded.</p>

                            <!-- Hero Image -->
                            <div style="margin-bottom:24px; border-radius:12px; overflow:hidden; background:#f0f7e6;">
                                <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=600&h=300"
                                    alt="Reminder from GEE Energy" style="display:block; width:100%; height:auto;" />
                            </div>

                            <a href="${offerLink}"
                                style="display:inline-block; background:#638C1C; color:#ffffff; padding:14px 28px; text-decoration:none; border-radius:6px; font-weight:700; font-size:14px;">Sign
                                Your Offer</a>
                        </td>
                    </tr>

                    <!-- DIVIDER -->
                    <tr>
                        <td>
                            <div style="height:1px; background:#e8e8e8; margin:24px 0;"></div>
                        </td>
                    </tr>

                    <!-- ACCESS CODE -->
                    ${verificationCode ? `<tr>
                        <td align="center" style="padding: 0 32px 24px;">
                            <p
                                style="font-size:11px; text-transform:uppercase; letter-spacing:1.5px; color:#888; margin:0 0 12px; font-weight:600;">
                                OFFER ACCESS CODE</p>
                            <div
                                style="border:1.5px dashed #638C1C; border-radius:8px; overflow:hidden; display:inline-block; min-width:240px; background:#ffffff;">
                                <div
                                    style="padding:22px 32px 18px; user-select:all; -webkit-user-select:all; -moz-user-select:all; cursor:text;">
                                    <p
                                        style="margin:0; font-size:18px; font-weight:600; letter-spacing:4px; color:#1a1a2e; font-family:monospace;">
                                        ${verificationCode}</p>
                                </div>
                                <div style="background:#638C1C; padding:12px 0; cursor:pointer;"
                                    title="Click the code above to select and copy.">
                                    <p
                                        style="margin:0; font-size:13px; font-weight:600; color:#ffffff; letter-spacing:1px; text-transform:uppercase;">
                                        COPY CODE</p>
                                </div>
                            </div>
                        </td>
                    </tr>` : ''}

                    <!-- PROMPT -->
                    <tr>
                        <td style="padding:0 32px 24px; text-align:center;">
                            <p style="margin:0; font-size:14px; color:#555; line-height:1.6;">If you have already
                                signed, please disregard this reminder and thank you!</p>
                        </td>
                    </tr>

                    <!-- DIVIDER -->
                    <tr>
                        <td>
                            <div style="height:1px; background:#e8e8e8;"></div>
                        </td>
                    </tr>

                    <!-- SWITCH WITH CONFIDENCE -->
                    <tr>
                        <td style="padding:28px 32px;">
                            <h2
                                style="margin:0 0 20px; font-size:18px; font-weight:700; color:#111; text-align:center;">
                                Switch with confidence</h2>
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td width="50%" style="padding:0 8px 16px 0; vertical-align:top;">
                                        <table cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                                <td
                                                    style="width:40px; height:40px; background:#eaf3de; border-radius:50%; text-align:center; vertical-align:middle;">
                                                    <img src="https://img.icons8.com/ios/40/638C1C/shield.png"
                                                        width="20" height="20" alt="Shield"
                                                        style="display:block; margin:auto;" />
                                                </td>
                                                <td style="padding-left:10px; vertical-align:middle;">
                                                    <p style="margin:0; font-size:13px; font-weight:700; color:#222;">
                                                        Secure digital signing</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                    <td width="50%" style="padding:0 0 16px 8px; vertical-align:top;">
                                        <table cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                                <td
                                                    style="width:40px; height:40px; background:#eaf3de; border-radius:50%; text-align:center; vertical-align:middle;">
                                                    <img src="https://img.icons8.com/ios/40/638C1C/price-tag.png"
                                                        width="20" height="20" alt="No fees"
                                                        style="display:block; margin:auto;" />
                                                </td>
                                                <td style="padding-left:10px; vertical-align:middle;">
                                                    <p style="margin:0; font-size:13px; font-weight:700; color:#222;">No
                                                        hidden fees or lock-ins</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td width="50%" style="padding:0 8px 0 0; vertical-align:top;">
                                        <table cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                                <td
                                                    style="width:40px; height:40px; background:#eaf3de; border-radius:50%; text-align:center; vertical-align:middle;">
                                                    <img src="https://img.icons8.com/ios/40/638C1C/flash-on.png"
                                                        width="20" height="20" alt="Fast"
                                                        style="display:block; margin:auto;" />
                                                </td>
                                                <td style="padding-left:10px; vertical-align:middle;">
                                                    <p style="margin:0; font-size:13px; font-weight:700; color:#222;">
                                                        Fast &amp; simple switching</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                    <td width="50%" style="padding:0 0 0 8px; vertical-align:top;">
                                        <table cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                                <td
                                                    style="width:40px; height:40px; background:#eaf3de; border-radius:50%; text-align:center; vertical-align:middle;">
                                                    <img src="https://img.icons8.com/ios/40/638C1C/home.png" width="20"
                                                        height="20" alt="Trusted" style="display:block; margin:auto;" />
                                                </td>
                                                <td style="padding-left:10px; vertical-align:middle;">
                                                    <p style="margin:0; font-size:13px; font-weight:700; color:#222;">
                                                        Trusted energy provider</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- DIVIDER -->
                    <tr>
                        <td>
                            <div style="height:1px; background:#e8e8e8;"></div>
                        </td>
                    </tr>

                    <!-- NEED ANY HELP -->
                    <tr>
                        <td style="padding:24px 32px; text-align:center;">
                            <h2 style="margin:0 0 16px; font-size:17px; font-weight:700; color:#111;">Need any help?
                            </h2>
                            <table cellpadding="0" cellspacing="0" border="0" align="center">
                                <tr>
                                    <td style="padding-right:24px;">
                                        <a href="tel:1300 707 042"
                                            style="display:inline-flex; align-items:center; text-decoration:none; color:#333; font-size:14px; font-weight:600;">
                                            <span
                                                style="display:inline-block; width:32px; height:32px; background:#eaf3de; border-radius:50%; text-align:center; line-height:32px; margin-right:8px; font-size:16px;">&#128222;</span>
                                            1300 707 042
                                        </a>
                                    </td>
                                    <td>
                                        <a href="mailto:support@geeenergy.com.au"
                                            style="display:inline-flex; align-items:center; text-decoration:none; color:#333; font-size:14px; font-weight:600;">
                                            <span
                                                style="display:inline-block; width:32px; height:32px; background:#eaf3de; border-radius:50%; text-align:center; line-height:32px; margin-right:8px; font-size:16px;">&#9993;</span>
                                            support@geeenergy.com.au
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- FOOTER -->
                    <tr>
                        <td
                            style="background:#f9f9f9; border-top:1px solid #e8e8e8; padding:20px 32px; text-align:center;">
                            <p style="margin:0 0 6px; font-size:12px; color:#777;">Thank you for choosing GEE Energy.
                            </p>
                            <p style="margin:0 0 10px; font-size:12px; color:#aaa;">This email not displaying correctly?
                                <a href="#" style="color:#638C1C; text-decoration:none;">View in browser</a></p>
                            <p style="margin:0 0 6px; font-size:11px; color:#bbb;">
                                <a href="#" style="color:#999; text-decoration:none;">Unsubscribe</a> &nbsp;|&nbsp;
                                <a href="#" style="color:#999; text-decoration:none;">Manage Preferences</a>
                                &nbsp;|&nbsp;
                                <a href="#" style="color:#999; text-decoration:none;">Privacy Policy</a> &nbsp;|&nbsp;
                                <a href="#" style="color:#999; text-decoration:none;">Terms of Service</a>
                            </p>
                            <p style="margin:0; font-size:11px; color:#ccc;">&#169; 2026 GEE POWER AND GAS PTY LTD. All
                                Rights Reserved.</p>
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