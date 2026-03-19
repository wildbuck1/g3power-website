# GC Bid List Email Setup — Autonomous Workflow

## What This Does
When a GC submits the bid list form on g3pwr.com/gc:
1. Auto-reply goes to the GC confirming they're on the list
2. Notification goes to contact@g3pwr.com with all their info

Email is sent via **Resend** (resend.com) — API key based, no SMTP config.

---

## One-Time Human Step (Required)
**Raul must do this once manually:**
1. Go to resend.com → Sign up / Log in
2. Go to **Domains** → Add `g3pwr.com` → add the DNS records GoDaddy shows
3. Go to **API Keys** → Create key → copy it
4. Go to Netlify → g3pwr.com → Site configuration → Environment variables
5. Add: `RESEND_API_KEY` = (the key you copied)
6. Click **Trigger deploy** in Netlify Deploys tab

That's it. Once done, emails work forever without touching passwords.

---

## Autonomous Steps (Claude Can Do These)

### If emails stop working
```
1. Run: curl -s -X POST "https://g3pwr.com/.netlify/functions/send-email" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "form-name=gc-bid-list&gc-company=Test&gc-contact=Test&gc-email=test@example.com&gc-phone=&gc-project-type=&gc-location=&gc-message=test"

2. If response is "RESEND_API_KEY not set" → tell Raul to add the key (see above)
3. If response is a Resend error → check resend.com/docs for the error code
4. If response is "OK" → emails are working, check spam folder
```

### To update email templates
- Edit: `netlify/functions/send-email.js`
- The GC auto-reply is in the first `send()` call
- Raul's notification is in the second `send()` call
- Commit and push — Netlify auto-deploys

### To add Google Sheets logging
```
1. Create a Google Service Account in console.cloud.google.com
2. Share the leads Google Sheet with the service account email
3. Add GOOGLE_SERVICE_ACCOUNT env var in Netlify (full JSON string)
4. Add LEADS_SHEET_ID env var (already set: sheet ID ending in l1js)
5. Add googleapis back to package.json
6. Add the Sheets logging block back to send-email.js
```

---

## File Locations
- Function: `netlify/functions/send-email.js`
- Form HTML: `gc.html` (search for `id="gc-form"`)
- Form posts to: `/.netlify/functions/send-email`
- Netlify project: g3pwr.com (wildbuck1/g3power-website on GitHub)

## Env Vars Needed
| Var | Value | Status |
|-----|-------|--------|
| `RESEND_API_KEY` | From resend.com | **NEEDS TO BE SET** |
| `LEADS_SHEET_ID` | Already set | ✓ |
| `GOOGLE_SERVICE_ACCOUNT` | Not set — Sheets logging disabled | Optional |
