const SENDER = 'notify@with.so'


const signInHtml = (firstName, url) => {
  return `
    <html>
      <body style="padding: 0px !important; margin: 0px !important; background: white;">
        <div style="padding:40px; margin:0px; background: white; max-width: 520px; margin: 0px auto;">
          <a href="https://with.so" target="_blank" rel="noopener noreferrer" data-auth="NotApplicable" class="x_logo-img" style="border:none; display:block; height:34px; text-decoration:none">
            <img data-imagetype="External" src="https://with.so/images/logo_medium.svg" alt="" width="auto" height="28" border="0" />
          </a>
          <h1 style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif!important; font-size:24px; line-height:1.6!important; color:#333; margin:0px!important; padding-top:20px;">
            Almost there!
          </h1>
          <p style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif!important; font-size:16px; line-height:1.6!important; color:#333; margin:0px!important">
            Here is your activation link for With. The link expires in an hour, but you can always get a new one by going through the sign in steps&nbsp;again.
          </p>
          <div style="margin-top:30px!important; margin-bottom:30px!important;">
            <a href="${url}" target="_blank" rel="noopener noreferrer" data-auth="NotApplicable" style="background-color:#ffd873; border-radius:6px; border:1px solid #ebc76a; box-shadow: 0px 2px 8px 0px #ededed; color:#333; display:inline-block; font-family:'Helvetica Neue',Helvetica,Arial,sans-serif!important; font-size:16px; font-weight:700; line-height:40px; padding:0 16px; text-align:center; text-decoration:none">
              Activate With
            </a>
          </div>
          <p style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif!important; font-size:13px; line-height:1.6!important; color:#333; margin:0px!important;">
            Or just copy the link below and paste it into your preferred browser.
          </p>
          <div style="border-radius:6px; margin-top:10px!important; padding: 12px; background: #fdf6ef; overflow-wrap: break-word; word-wrap: break-word; -ms-word-break: break-all; word-break: break-word; font-family:'Helvetica Neue',Helvetica,Arial,sans-serif!important; font-size:13px; line-height:1.6!important; color:#333;">
            ${url}
          </div>
          <div style="margin-top:20px!important; font-family:'Helvetica Neue',Helvetica,Arial,sans-serif!important; font-size:10px; line-height:1.6!important; color:#aaa;">
            <b>With Labs, Inc.</b><br/> 595 Pacific Ave, 4th Floor<br/> San Francisco, CA 94133
          </div>
        </div>
      </body>
    </html>
  `
}

class AccountEmails {
  constructor() {
  }

  async sendSignupOtpEmail(toEmail, firstName, url) {
    const subject = `Your activation link for With, ${firstName}!`
    const html = signInHtml(firstName, url)
    const plaintextFallback = `To finish your signup process and log in, please open the following url: ${url}`
    const tags = [{Name: "type", Value: "signup"}]
    return await lib.email.ses.sendMail(SENDER, toEmail, subject, html, plaintextFallback, tags)
  }

  async sendLoginOtpEmail(toEmail, firstName, url) {
    const subject = `Your activation link for With, ${firstName}!`
    const html = signInHtml(firstName, url)
    const plaintextFallback = `
      Here is your activation link for With.
      The link expires in an hour, but you can always get a new one by going through the sign in steps again.
      ${url}
      If you didn't request an activation link, just ignore this email. Someone probably mistyped their email address.
      With Labs, 595 Pacific Ave, 4th Floor, San Francisco, CA 94133
    `
    const tags = [{Name: "type", Value: "login"}]
    return await lib.email.ses.sendMail(SENDER, toEmail, subject, html, plaintextFallback, tags)
  }

}

module.exports = new AccountEmails()
