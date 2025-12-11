export const EMAIL_VERIFICATION_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Verification</title>
  </head>
  <body style="background-color: #ffffff; font-family: Arial, sans-serif;">
    <div
      style="
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      "
    >
      <div
        style="
          text-align: center;
          margin-bottom: 30px;
        "
      >
        <img
          src="https://example.com/placeholder.svg"
          width="96"
          height="96"
          alt="Auth Inc"
          style="border-radius: 8px; object-fit: cover;"
        />
        <h1
          style="
            font-size: 24px;
            font-weight: bold;
            margin-top: 16px;
          "
        >
          Verify your email address
        </h1>
      </div>
      <div
        style="
          padding: 0 10px;
          text-align: center;
          margin-bottom: 40px;
        "
      >
        <p>Hello,</p>
        <p>
          We received a request to verify this email address. If you didn’t make
          this request, please ignore or delete this email.
        </p>
        <p>Click the button below to verify your email address:</p>
        <a
          href="{URL}"
          style="
            background-color: #000;
            color: #fff;
            padding: 12px 20px;
            border-radius: 6px;
            text-decoration: none;
            display: inline-block;
            margin-top: 10px;
            margin-bottom: 5px;
            font-weight: bold;
          "
          >Verify email</a>
        <p>This link will expire in 15 minutes for security reasons.</p>
        <p>
          Best regards,<br />
          Routana Team
        </p>
      </div>
      <div
        style="
          font-size: 12px;
          color: #888;
          text-align: center;
        "
      >
        <p style="margin-bottom: 6px;">
          Need help? Contact us at
          <a
            href="mailto:support@example.com"
            style="color: #555; text-decoration: underline;"
            >support@example.com</a
          >
        </p>
        <p style="margin-bottom: 6px;">
          This is an automated message, please do not reply to this email.
        </p>
      </div>
    </div>
  </body>
</html>
`;

export const PASSWORD_RESET_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Password Reset</title>
  </head>
  <body style="background-color: #ffffff; font-family: Arial, sans-serif;">
    <div
      style="
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      "
    >
      <div
        style="
          text-align: center;
          margin-bottom: 30px;
        "
      >
        <img
          src="https://example.com/placeholder.svg"
          width="96"
          height="96"
          alt="Auth Inc"
          style="border-radius: 8px; object-fit: cover;"
        />
        <h1
          style="
            font-size: 24px;
            font-weight: bold;
            margin-top: 16px;
          "
        >
          Reset your password
        </h1>
      </div>

      <div
        style="
          padding: 0 10px;
          text-align: center;
          margin-bottom: 40px;
        "
      >
        <p>Hello,</p>
        <p>
          We received a request to reset your password. If you didn’t make this
          request, please ignore or delete this email.
        </p>
        <p>Click the button below to reset your password:</p>
        <a
          href="{URL}"
          style="
            background-color: #000;
            color: #fff;
            padding: 12px 20px;
            border-radius: 6px;
            text-decoration: none;
            display: inline-block;
            margin-top: 10px;
            margin-bottom: 5px;
            font-weight: bold;
          "
          >Reset Password</a
        >
        <p>This link will expire in 15 minutes for security reasons.</p>
        <p>
          Best regards,<br />
          Routana Team
        </p>
      </div>

      <div
        style="
          font-size: 12px;
          color: #888;
          text-align: center;
        "
      >
        <p style="margin-bottom: 6px;">
          Need help? Contact us at
          <a
            href="mailto:support@example.com"
            style="color: #555; text-decoration: underline;"
            >support@example.com</a
          >
        </p>
        <p style="margin-bottom: 6px;">
          This is an automated message, please do not reply to this email.
        </p>
      </div>
    </div>
  </body>
</html>
`;

export const EMAIL_CHANGE_TEMPLATE = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Email Change Requested</title>
    </head>
    <body style="margin:0; padding:0; background-color:#ffffff; font-family:Arial, sans-serif;">
      <div style="max-width:600px; margin:0 auto; padding:40px 20px;">
        <div style="text-align:center; margin-bottom:32px;">
          <img
            src="https://example.com/placeholder.svg"
            width="96"
            height="96"
            alt="Acme Inc"
            style="display:block; margin:0 auto 16px;"
          />
          <h1 style="font-size:24px; font-weight:bold; margin:0;">
            Email change requested
          </h1>
        </div>

        <div style="font-size:15px; line-height:1.6; color:#333; margin-bottom:32px;">
          <p>Hello,</p>
          <p>
            We received a request to change your account email to
            <strong>{{newEmail}}</strong>. If this was you, no further action is
            needed. If not, please contact our support team immediately to secure
            your account.
          </p>
          <p>
            Best regards,<br />
            Routana Team
          </p>
        </div>

        <div style="font-size:13px; color:#999; text-align:center;">
          <p style="margin:0 0 8px;">
            Need help? Contact us at
            <a href="mailto:support@example.com" style="color:#555; text-decoration:underline;">
              support@example.com
            </a>
          </p>
          <p style="margin:0;">
            This is an automated message, please do not reply to this email.
          </p>
        </div>
      </div>
    </body>
  </html>
  `
