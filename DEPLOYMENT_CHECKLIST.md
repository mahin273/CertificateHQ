# 🚀 Final Deployment Steps

## Current Status
- ✅ Local server works perfectly
- ✅ Certificate generation works
- ✅ Email sending works
- ⏳ Vercel deployment in progress

## Once Vercel Deployment Succeeds:

### 1. Get Your Vercel URL
Your deployment URL will be something like:
```
https://certificate-hq.vercel.app
```
or
```
https://certificate-hq-xxxxx.vercel.app
```

### 2. Add Environment Variables in Vercel
Go to: https://vercel.com/mahin273s-projects/certificate-hq/settings/environment-variables

Add these variables:
- `EMAIL_USER` = `hitmanlabib2@gmail.com`
- `EMAIL_PASS` = `stevrbkybtosdmtu` (no spaces!)
- `EMAIL_SUBJECT` = `Your Certificate is Ready!` (optional)
- `EMAIL_BODY` = `Dear {name},\n\nCongratulations! Your certificate is attached.\n\nBest regards` (optional)

After adding, click **"Redeploy"** to apply the changes.

### 3. Update Google Apps Script
In your Google Form's Apps Script editor, update the URL:

**Change from:**
```javascript
var url = "http://localhost:3000/webhook";
```

**Change to:**
```javascript
var url = "https://YOUR-VERCEL-URL.vercel.app/webhook";
```

For example:
```javascript
var url = "https://certificate-hq.vercel.app/webhook";
```

Save the script (Ctrl+S).

### 4. Test the Complete Flow
1. Open your Google Form
2. Fill in:
   - Name: Your Name
   - Email: Your actual email
3. Submit
4. Check your email inbox!

## Troubleshooting

### If email doesn't arrive:
1. Check Vercel function logs:
   - Go to your deployment
   - Click "Functions" tab
   - Look for errors

2. Check Google Apps Script execution log:
   - In Apps Script editor
   - Click "Executions" (clock with arrow icon)
   - Look for recent runs and any errors

3. Verify environment variables are set correctly in Vercel

### If webhook doesn't trigger:
1. Make sure the trigger is set up in Apps Script:
   - Click "Triggers" (clock icon)
   - Should see: `onSubmit` → `From form` → `On form submit`

2. Check the URL in your script matches your Vercel URL exactly

## Current Configuration

**Email Account:** hitmanlabib2@gmail.com  
**Server Port (Local):** 3000  
**Database:** SQLite (resets on each Vercel deployment)  
**Certificate Format:** PNG image  

---

**Next Step:** Wait for Vercel deployment to succeed, then follow steps above! 🎉
