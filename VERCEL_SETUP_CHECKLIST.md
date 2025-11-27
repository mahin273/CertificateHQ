# Vercel Setup Checklist - Do This Now!

## ✅ Step 1: Add Environment Variables (2 minutes)

1. Go to: https://vercel.com/dashboard
2. Click on your project: **CertificateHQ**
3. Click **Settings** (top menu)
4. Click **Environment Variables** (left sidebar)
5. Add these 2 required variables:

### Variable 1:
- **Name**: `EMAIL_USER`
- **Value**: Your Gmail address (e.g., `yourname@gmail.com`)
- Click **Add**

### Variable 2:
- **Name**: `EMAIL_PASS`
- **Value**: Your Gmail App Password (NOT your regular password!)
- Click **Add**

**How to get Gmail App Password:**
1. Go to: https://myaccount.google.com/apppasswords
2. Create app password for "Mail"
3. Copy the 16-character password
4. Paste it in `EMAIL_PASS`

### Optional Variables (customize email):
- **Name**: `EMAIL_SUBJECT` | **Value**: `Your Certificate is Here!`
- **Name**: `EMAIL_BODY` | **Value**: `Dear {name},\n\nCongratulations! Please find your certificate attached.\n\nBest regards,\nAdmin`

## ✅ Step 2: Redeploy (30 seconds)

After adding variables:
1. Go to **Deployments** tab
2. Click the **⋯** (three dots) on the latest deployment
3. Click **Redeploy**
4. Wait for it to finish (shows "Ready")

## ✅ Step 3: Copy Your URL

1. After deployment succeeds, you'll see your URL
2. It looks like: `https://certificate-hq-xxxxx.vercel.app`
3. **Copy this URL** - you'll need it for Google Forms

## ✅ Step 4: Update Google Script

1. Open your Google Form
2. Click **⋮** (three dots) → **Script editor**
3. Delete everything in the editor
4. Copy the script from `google-script.js` in your project
5. **Replace this line**:
   ```javascript
   var url = "https://YOUR_VERCEL_PROJECT.vercel.app/webhook";
   ```
   With your actual URL:
   ```javascript
   var url = "https://certificate-hq-xxxxx.vercel.app/webhook";
   ```
6. Save (Ctrl+S)

## ✅ Step 5: Add Trigger

1. In Script Editor, click the **⏰ Clock icon** (Triggers)
2. Click **+ Add Trigger**
3. Settings:
   - Function: `onSubmit`
   - Event source: `From form`
   - Event type: `On form submit`
4. Click **Save**
5. Authorize the script (Google will ask for permissions)

## ✅ Step 6: Test!

1. Submit a test response to your Google Form
2. Check the email you submitted
3. You should receive a certificate!

---

## Troubleshooting

**Email not sending?**
- Check Vercel function logs: Project → Deployments → Click deployment → Functions tab
- Verify EMAIL_USER and EMAIL_PASS are correct
- Make sure you're using App Password, not regular password

**Webhook not triggering?**
- Check the URL in google-script.js matches your Vercel URL exactly
- Make sure trigger is set up correctly
- Check Google Apps Script logs: Script Editor → Executions

**Need help?** Share the error message and I'll help debug!
