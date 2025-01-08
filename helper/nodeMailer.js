//use nodemailer to send activation code to user email
import nodemailer from 'nodemailer'
import { config } from 'dotenv'

config({ path: '../../config/.env' })
//create reusable transporter object using the default SMTP transport
const transporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  })
}

const sendActiveEmail = async (subject, email, html) => {
  transporter().sendMail(
    {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: subject,
      html: html
    },
    function (error, info) {
      if (error) {
        console.log('Error connecting to the mail server: ', error)
      } else {
        console.log('Email sent: ' + info.response)
      }
    }
  )
}

const htmlContentInlineCSS = (code, name, activeEmail) => {
  return `
  <html>
    <head>
      <style>
        /* Inline CSS */
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          color: #333;
          margin: 10px;
          padding: 20px;
          text-align: center;
        }
        .container {
          width: 80%;
          margin: 0 auto;
          background-color: #fff;
          padding: 20px;
          border-radius: 5px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          padding-left : 50px;
        }
        h1 {
          font-size: 24px;
          margin-bottom: 20px;
          color: black;

        }
        h2 {
          font-size: 18px;
          color: black;
          margin-bottom: 10px;
          text-transform : capitalize;
        }
        span {
          color: blue;
          font-weight: bold;
          font-size: 25px;
          margin-left: 20px;

        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Welcome ${name} in Coonex Organization</h1>
        <h2>activation code : <span id="code">${code}</span></h2>
        <button onClick =${activeEmail}>active Your Email</button>

      </div>
    </body>
  </html>
`
}
const htmlContentInRePassLineCSS = code => {
  return `
  <html>
    <head>
      <style>
        /* Inline CSS */
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          color: #333;
          margin: 10px;
          padding: 20px;
          text-align: center;
        }
        .container {
          width: 80%;
          margin: 0 auto;
          background-color: #fff;
          padding: 20px;
          border-radius: 5px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          padding-left : 50px;
        }
        h1 {
          font-size: 24px;
          margin-bottom: 20px;
          color: black;

        }
        h2 {
          font-size: 18px;
          color: black;
          margin-bottom: 10px;
          text-transform : capitalize;
        }
        span {
          color: blue;
          font-weight: bold;
          font-size: 25px;
          margin-left: 20px;

        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Welcome in Rmoz Organization</h1>
        <h2>Rest Password code : <span id="code">${code}</span></h2>
        <button onClick>Rest Password</button>

      </div>
    </body>
  </html>
`
}
const htmlContentInMemberPasswordLineCSS = link => {
  return `
  <html>
    <head>
      <style>
        /* Inline CSS */
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          color: #333;
          margin: 10px;
          padding: 20px;
          text-align: center;
        }
        .container {
          width: 80%;
          margin: 0 auto;
          background-color: #fff;
          padding: 20px;
          border-radius: 5px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          padding-left : 50px;
        }
        h1 {
          font-size: 24px;
          margin-bottom: 20px;
          color: black;

        }
        h2 {
          font-size: 18px;
          color: black;
          margin-bottom: 10px;
          text-transform : capitalize;
        }
        span {
          color: blue;
          font-weight: bold;
          font-size: 12px;
          margin-left: 20px;

        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Welcome in Coonex Organization</h1>
        <h2>Create Password Link :</h2>
        <span id="code">${link}</span>


      </div>
    </body>
  </html>
`
}

const htmlContentForActivationEmail = link => {
  return `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          color: #333;
          margin: 0;
          padding: 0;
          text-align: center;
        }
        .container {
          width: 80%;
          margin: 40px auto;
          background-color: #ffffff;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
          background-color: #007bff;
          color: white;
          padding: 20px;
          border-radius: 10px 10px 0 0;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
        }
        .content {
          padding: 20px;
        }
        .content h2 {
          font-size: 22px;
          margin-bottom: 20px;
          color: #333;
        }
        .content p {
          font-size: 16px;
          color: #555;
          margin-bottom: 30px;
        }
        .activation-link {
          display: inline-block;
          padding: 12px 25px;
          font-size: 18px;
          color: white;
          background-color: #28a745;
          text-decoration: none;
          border-radius: 5px;
          transition: background-color 0.3s ease;
        }
        .activation-link:hover {
          background-color: #218838;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          color: #888;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Coonex Organization</h1>
        </div>
        <div class="content">
          <h2>Activate Your Account</h2>
          <p>Thank you for signing up with Coonex Organization! To start using your account, please confirm your email address by clicking the button below:</p>
          <a href="${link}" class="activation-link">Activate Account</a>
        </div>
        <div class="footer">
          <p>If you did not sign up for this account, please ignore this email or <a href="mailto:support@coonex.org" style="color: #007bff; text-decoration: none;">contact support</a>.</p>
          <p>&copy; 2024 Coonex Organization. All rights reserved.</p>
        </div>
      </div>
    </body>
  </html>
  `
}

const htmlContentForCongratulationsEmail = () => {
  return `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          color: #333;
          margin: 0;
          padding: 0;
          text-align: center;
        }
        .container {
          width: 80%;
          margin: 40px auto;
          background-color: #ffffff;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
          background-color: #28a745;
          color: white;
          padding: 20px;
          border-radius: 10px 10px 0 0;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
        }
        .content {
          padding: 20px;
        }
        .content h2 {
          font-size: 22px;
          margin-bottom: 20px;
          color: #333;
        }
        .content p {
          font-size: 16px;
          color: #555;
          margin-bottom: 30px;
        }
        .cta-button {
          display: inline-block;
          padding: 12px 25px;
          font-size: 18px;
          color: white;
          background-color: #007bff;
          text-decoration: none;
          border-radius: 5px;
          transition: background-color 0.3s ease;
        }
        .cta-button:hover {
          background-color: #0056b3;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          color: #888;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Congratulations!</h1>
        </div>
        <div class="content">
          <h2>Your Email Has Been Successfully Verified</h2>
          <p>Welcome to Coonex Organization! Your email has been successfully verified, and your account is now fully active. We're thrilled to have you on board!</p>
          <p>Click the button below to log in and start exploring:</p>
          <a href="https://crm.coonex.io/login" class="cta-button">Go to Login</a>
        </div>
        <div class="footer">
          <p>If you have any questions or need assistance, feel free to <a href="mailto:support@coonex.org" style="color: #007bff; text-decoration: none;">contact our support team</a>.</p>
          <p>&copy; 2024 Coonex Organization. All rights reserved.</p>
        </div>
      </div>
    </body>
  </html>
  `
}
const createLoginEmailContent = (member, loginLink) => {
  return `
  <html>
    <head>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f4f4f4;
          color: #333;
          margin: 0;
          padding: 0;
          text-align: center;
        }
        .container {
          width: 80%;
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          text-align: left;
        }
        h1 {
          font-size: 28px;
          color: #333;
          margin-bottom: 20px;
          text-align: center;
        }
        p {
          font-size: 16px;
          color: #555;
          line-height: 1.6;
          margin-bottom: 20px;
        }
        .login-info {
          font-size: 16px;
          color: #333;
          margin-bottom: 20px;
        }
        .login-info span {
          color: #007bff;
          font-weight: bold;
        }
        .login-link {
          display: block;
          width: fit-content;
          margin: 30px auto;
          padding: 12px 25px;
          font-size: 16px;
          background-color: #007bff;
          color: #ffffff;
          text-decoration: none;
          border-radius: 5px;
          text-align: center;
        }
        .login-link:hover {
          background-color: #0056b3;
        }
        .footer {
          font-size: 12px;
          color: #888;
          text-align: center;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Welcome to Coonex Organization</h1>
        <p>Dear ${member.name},</p>
        <p>We are thrilled to have you as part of our community. Below is your login information:</p>
        <div class="login-info">
          <p><strong>Email:</strong><span> ${member.email}</span></p>
          <p><strong>Password:</strong><span> ${member.password}</span></p>
        </div>
        <a href="${loginLink}" class="login-link">Log in to Your Account</a>
        <p>If you have any questions or need assistance, don't hesitate to reach out to our support team.</p>
        <p>Best regards,<br/>Coonex Organization</p>
      </div>
      <div class="footer">
        <p>© 2024 Coonex Organization. All rights reserved.</p>
      </div>
    </body>
  </html>
  `
}
//********************************************************************** */

const htmlContentForPasswordChangeEmail = () => {
  return `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          color: #333;
          margin: 0;
          padding: 0;
          text-align: center;
        }
        .container {
          width: 80%;
          margin: 40px auto;
          background-color: #ffffff;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
          background-color: #dc3545;
          color: white;
          padding: 20px;
          border-radius: 10px 10px 0 0;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
        }
        .content {
          padding: 20px;
        }
        .content h2 {
          font-size: 22px;
          margin-bottom: 20px;
          color: #333;
        }
        .content p {
          font-size: 16px;
          color: #555;
          margin-bottom: 30px;
        }
        .cta-button {
          display: inline-block;
          padding: 12px 25px;
          font-size: 18px;
          color: white;
          background-color: #007bff;
          text-decoration: none;
          border-radius: 5px;
          transition: background-color 0.3s ease;
        }
        .cta-button:hover {
          background-color: #0056b3;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          color: #888;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Changed</h1>
        </div>
        <div class="content">
          <h2>Your Password Has Been Successfully Updated</h2>
          <p>Hello,</p>
          <p>We wanted to inform you that your password has been successfully changed. If you made this change, no further action is required.</p>
          <p>If you did not change your password, please <a href="" style="color: #007bff; text-decoration: none;">reset your password immediately</a> or contact our support team.</p>
        </div>
        <div class="footer">
          <p>If you have any questions or need assistance, feel free to <a href="mailto:support@coonex.org" style="color: #007bff; text-decoration: none;">contact our support team</a>.</p>
          <p>&copy; 2024 Rmoz Organization. All rights reserved.</p>
        </div>
      </div>
    </body>
  </html>
  `
}

// ******************************************
const htmlContentForInvitationAcceptedEmail = () => {
  return `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          color: #333;
          margin: 0;
          padding: 0;
          text-align: center;
        }
        .container {
          width: 80%;
          margin: 40px auto;
          background-color: #ffffff;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
          background-color: #28a745;
          color: white;
          padding: 20px;
          border-radius: 10px 10px 0 0;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
        }
        .content {
          padding: 20px;
        }
        .content h2 {
          font-size: 22px;
          margin-bottom: 20px;
          color: #333;
        }
        .content p {
          font-size: 16px;
          color: #555;
          margin-bottom: 30px;
        }
        .cta-button {
          display: inline-block;
          padding: 12px 25px;
          font-size: 18px;
          color: white;
          background-color: #007bff;
          text-decoration: none;
          border-radius: 5px;
          transition: background-color 0.3s ease;
        }
        .cta-button:hover {
          background-color: #0056b3;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          color: #888;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Invitation Accepted!</h1>
        </div>
        <div class="content">
          <h2>Your Invitation to Join Coonex Organization Has Been Accepted</h2>
          <p>We're excited to have you as part of the Coonex Organization. You’ve successfully accepted our invitation, and your account is ready to go!</p>
          <p>Click the button below to log in and get started:</p>
          <a href="https://crm.coonex.io/login" class="cta-button">Go to Login</a>
        </div>
        <div class="footer">
          <p>If you have any questions or need assistance, feel free to <a href="mailto:support@coonex.org" style="color: #007bff; text-decoration: none;">contact our support team</a>.</p>
          <p>&copy; 2024 Coonex Organization. All rights reserved.</p>
        </div>
      </div>
    </body>
  </html>
  `
}

//************************************************************* */
const createInviteEmailContent = (member, inviteLink, loginLink) => {
  return `
  <html>
    <head>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f4f4f4;
          color: #333;
          margin: 0;
          padding: 0;
          text-align: center;
        }
        .container {
          width: 80%;
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          text-align: left;
        }
        h1 {
          font-size: 28px;
          color: #333;
          margin-bottom: 20px;
          text-align: center;
        }
        p {
          font-size: 16px;
          color: #555;
          line-height: 1.6;
          margin-bottom: 20px;
        }
        .login-info {
          font-size: 16px;
          color: #333;
          margin-bottom: 20px;
        }
        .login-info span {
          color: #007bff;
          font-weight: bold;
        }
        .cta-button {
          display: block;
          width: fit-content;
          margin: 20px auto;
          padding: 12px 25px;
          font-size: 16px;
          background-color: #007bff;
          color: #ffffff;
          text-decoration: none;
          border-radius: 5px;
          text-align: center;
        }
        .cta-button:hover {
          background-color: #0056b3;
        }
        .footer {
          font-size: 12px;
          color: #888;
          text-align: center;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Welcome to Coonex Organization</h1>
        <p>Dear ${member.name},</p>
        <p>We are excited to invite you to join Coonex Organization! Please accept the invitation to complete your registration before logging in to your account.</p>
        <a href="${inviteLink}" class="cta-button">Accept Invitation</a>
        <p>After accepting the invitation, use the following credentials to log in:</p>
        <div class="login-info">
          <p><strong>Email:</strong><span> ${member.email}</span></p>
          <p><strong>Password:</strong><span> ${member.password}</span></p>
        </div>
        <a href="${loginLink}" class="cta-button">Log in to Your Account</a>
        <p>If you have any questions or need assistance, don't hesitate to reach out to our support team.</p>
        <p>Best regards,<br/>Coonex Organization</p>
      </div>
      <div class="footer">
        <p>© 2024 Coonex Organization. All rights reserved.</p>
      </div>
    </body>
  </html>
  `
}

const htmlForActivationEmail = () => {
  return `
<html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f9f9f9;
        color: #333;
        margin: 0;
        padding: 0;
      }
      .container {
        width: 90%;
        max-width: 600px;
        margin: 50px auto;
        background-color: #ffffff;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
      }
      .header {
        background-color: #007bff;
        color: #ffffff;
        padding: 20px;
        text-align: center;
      }
      .header h1 {
        font-size: 24px;
        margin: 0;
      }
      .content {
        padding: 30px;
        text-align: center;
      }
      .content h2 {
        font-size: 20px;
        margin-bottom: 15px;
        color: #333;
      }
      .content p {
        font-size: 16px;
        margin-bottom: 20px;
        color: #555;
        line-height: 1.5;
      }
      .cta-button {
        display: inline-block;
        padding: 12px 25px;
        font-size: 16px;
        color: white;
        background-color: #28a745;
        text-decoration: none;
        border-radius: 5px;
        transition: background-color 0.3s ease;
      }
      .cta-button:hover {
        background-color: #218838;
      }
      .footer {
        background-color: #f4f4f4;
        padding: 15px;
        font-size: 14px;
        color: #666;
        text-align: center;
        border-top: 1px solid #ddd;
      }
      .footer a {
        color: #007bff;
        text-decoration: none;
      }
      .footer a:hover {
        text-decoration: underline;
      }
      .divider {
        height: 1px;
        background-color: #ddd;
        margin: 30px 0;
      }
      .arabic {
        text-align: right;
        direction: rtl;
        font-family: 'Tahoma', sans-serif;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Congratulations!</h1>
      </div>
      <div class="content">
        <h2>Your Account is Now Active</h2>
        <p>
          Welcome to Coonex Organization! Your account has been successfully activated.
          You can log in now using the button below.
        </p>
        <a href="https://crm.coonex.io/login" class="cta-button">Log in to Your Account</a>
        <div class="divider"></div>
        <p>
          Should you need any assistance or wish to learn more about Coonex Software,
          please feel free to contact your account manager directly through your account
          or email <a href="mailto:support@coonex.io">support@coonex.io</a>.
        </p>
        <div class="divider"></div>
        <div class="arabic">
          <h2>تهانينا!</h2>
          <p>
            تم تفعيل حسابك الآن. يمكنك تسجيل الدخول باستخدام الزر أدناه.
          </p>
          <a href="https://crm.coonex.io/login" class="cta-button">تسجيل الدخول إلى حسابك</a>
          <div class="divider"></div>
          <p>
            إذا كنت بحاجة إلى أي مساعدة أو ترغب في معرفة المزيد عن برنامج Coonex،
            لا تتردد في التواصل مع مدير حسابك مباشرة من خلال حسابك أو عبر البريد الإلكتروني
            <a href="mailto:support@coonex.io">support@coonex.io</a>.
          </p>
        </div>
      </div>
      <div class="footer">
        <p>&copy; 2024 Coonex Organization. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>`
}

const htmlContentForTwoFactorAuth = code => {
  return `
    <html>
      <head>
        <style>
          /* Inline CSS */
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            margin: 10px;
            padding: 20px;
            text-align: center;
          }
          .container {
            width: 80%;
            margin: 0 auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            padding-left: 50px;
          }
          h1 {
            font-size: 24px;
            margin-bottom: 20px;
            color: black;
          }
          h2 {
            font-size: 18px;
            color: black;
            margin-bottom: 10px;
            text-transform: capitalize;
          }
          span {
            color: blue;
            font-weight: bold;
            font-size: 25px;
            margin-left: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Welcome to Coonex Organization</h1>
          <h2>Your Two-Factor Authentication Code: <span id="code">${code}</span></h2>
          <p>Please use this code to complete your authentication process. This code will expire in 5 minutes.</p>
        </div>
      </body>
    </html>
    `
}

export {
  sendActiveEmail,
  htmlContentInlineCSS,
  htmlContentInRePassLineCSS,
  htmlContentInMemberPasswordLineCSS,
  htmlContentForActivationEmail,
  htmlContentForCongratulationsEmail,
  createLoginEmailContent,
  htmlContentForPasswordChangeEmail,
  createInviteEmailContent,
  htmlContentForInvitationAcceptedEmail,
  htmlForActivationEmail,
  htmlContentForTwoFactorAuth
}
