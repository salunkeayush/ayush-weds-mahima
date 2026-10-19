# RSVP setup (Google Form + Sheet)

The site's RSVP form posts to a Google Form you own. Responses land in a Google Sheet, and Google emails each guest a copy.

## 1. Create the form
1. Go to https://forms.google.com and create a blank form titled "Mahima & Ayush RSVP".
2. Add exactly these questions, in this order:
   - **Name** (Short answer, required)
   - **Attending** (Multiple choice, required). Options must be exactly `Yes` and `No`.
   - **Number of people** (Short answer, required)
3. Settings → Responses → **Collect email addresses: Responder input**, and **Send responders a copy of their response: Always**.
4. Responses tab → **Link to Sheets** → create a new spreadsheet. That is your host dashboard.

## 2. Get the IDs
1. Form menu (⋮) → **Get pre-filled link**. Fill each question with dummy text (use `Yes` for Attending), click **Get link**, copy it.
2. In the link, note the `entry.NNNN` keys for Name, Attending and Number of people, and the form's `/d/e/<ID>/viewform` part. For Email, the key is `emailAddress`.
3. Edit `js/config.js`, section `RSVP`:
   - `FORM_ACTION_URL`: `https://docs.google.com/forms/d/e/<ID>/formResponse`
   - `FIELD_NAMES`: `{ name: 'entry.NNN', email: 'emailAddress', attending: 'entry.NNN', count: 'entry.NNN' }`

## 3. Test before sharing
1. Open the site, submit a test RSVP with your own email.
2. Confirm: (a) a new row appears in the Sheet, (b) you receive Google's confirmation email.
3. If the row appears but **no email arrives**: set `USE_EMBED: true` and `EMBED_URL` to the form's `viewform?embedded=true` link in `js/config.js`. The plain Google Form is then shown in the page, and Google's receipt is guaranteed.
4. Delete the test row from the Sheet.
