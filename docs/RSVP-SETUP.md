# RSVP setup

## How it works
- The site's themed RSVP form sends each reply to a small **Google Apps Script** that you own. The script adds a row to a Google Sheet and emails the guest a confirmation (with the venue, map link and schedule).
- Why not submit to the Google Form directly? Google now protects Google Forms with reCAPTCHA, so posts from other websites are refused (HTTP 400/401) and nothing is saved. The script avoids that and lets the site show a real "saved" or "failed" result.
- Until the script URL is added in `js/config.js` (`RSVP.SCRIPT_URL`), the site embeds the Google Form instead (it records replies itself; the form must allow anonymous replies: Settings > Responses > Collect email addresses = Responder input, Limit to 1 response = OFF).

## One-time setup (about 5 minutes)
1. Create a new Google Sheet (https://sheets.new) and name it "Wedding RSVPs". This is your dashboard.
2. In the Sheet: **Extensions > Apps Script**. Delete the sample code and paste everything from `apps-script/Code.gs`. Click Save.
3. **Deploy > New deployment > (gear icon) Web app**. Set **Execute as: Me** and **Who has access: Anyone**. Click Deploy.
4. When Google asks for permission, choose your account > **Advanced > Go to project (unsafe) > Allow**. (It needs to write to the Sheet and send email as you.)
5. Copy the **Web app URL** (it ends in `/exec`). Paste it into `js/config.js` as `SCRIPT_URL`, or send it to Claude to do it.
6. Open the URL in a browser: it should show `{"ok":true,"service":"rsvp"}`.
7. Test on the site (use a private window), then check the Sheet's **RSVPs** tab for the row and your inbox for the email. Delete the test row.

## Good to know
- Each row records time, name, email, Yes/No, number of people and which link the guest used (full invite or without Mayra).
- A free Gmail account can send about 100 emails a day. If that is used up the RSVP is still saved (the guest just sees "Your RSVP is saved" without the email line).
- The same email address is only emailed once every 10 minutes, to stop accidental double sends.
- Changing the script later: Deploy > Manage deployments > edit > New version (the URL stays the same).
- Keep `apps-script/Code.gs` event times in sync with `js/config.js` (a test checks this).
