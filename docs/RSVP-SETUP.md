# RSVP setup

## How it works
- The site's themed RSVP form sends each reply to a small **Google Apps Script** that you own. The script adds a row to a Google Sheet and emails the guest a confirmation (with the venue, map link and schedule).
- Why not submit to the Google Form directly? Google now protects Google Forms with reCAPTCHA, so posts from other websites are refused (HTTP 400/401) and nothing is saved. The script avoids that and lets the site show a real "saved" or "failed" result.
- Until the script URL is added in `js/config.js` (`RSVP.SCRIPT_URL`), the site embeds the Google Form instead (it records replies itself; the form must allow anonymous replies: Settings > Responses > Collect email addresses = Responder input, Limit to 1 response = OFF).

## One-time setup (about 5 minutes)
Use **one** Google account for everything (the one you want the emails to come from). If your browser has several Google accounts signed in, Apps Script can fail with "Sorry, unable to open the file" (the address shows `authuser=1`). Avoid it by doing the steps below in a **new Incognito window** signed in to just that account.
1. Go to https://script.google.com and click **New project**. (Do not use the menu inside Google Forms: that makes a script attached to the form.)
2. Delete the sample code and paste everything from `apps-script/Code.gs`. Click Save (name it "Wedding RSVP").
3. In the function dropdown at the top choose **setup** and click **Run**. Google asks for permission: **Review permissions > pick your account > Advanced > Go to Wedding RSVP (unsafe) > Allow**. The log at the bottom prints the address of the new "Wedding RSVPs" Sheet (it also appears in your Google Drive). This is your dashboard.
4. **Deploy > New deployment > (gear icon) Web app**. Set **Execute as: Me** and **Who has access: Anyone**. Click Deploy.
5. Copy the **Web app URL** (it ends in `/exec`). Paste it into `js/config.js` as `SCRIPT_URL`, or send it to Claude to do it.
6. Open the URL in a browser: it should show `{"ok":true,"service":"rsvp"}`.
7. Test on the site (use a private window), then check the Sheet's **RSVPs** tab for the row and your inbox for the email. Delete the test row.

## Good to know
- Each row records time, name, email, Yes/No, number of people and which link the guest used (full invite or without Mayra).
- A free Gmail account can send about 100 emails a day. If that is used up the RSVP is still saved (the guest just sees "Your RSVP is saved" without the email line).
- The same email address is only emailed once every 10 minutes, to stop accidental double sends.
- Changing the script later: Deploy > Manage deployments > edit > New version (the URL stays the same).
- Keep `apps-script/Code.gs` event times in sync with `js/config.js` (a test checks this).
