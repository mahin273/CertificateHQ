# Vercel Deployment Guide

## Quick Deploy Steps

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Vercel will auto-detect the settings
5. Click "Deploy"

### 3. Configure Environment Variables
After deployment, go to your project settings:
1. Navigate to **Settings** → **Environment Variables**
2. Add the following variables:

| Variable Name | Value | Description |
|--------------|-------|-------------|
| `EMAIL_USER` | your-email@gmail.com | Your Gmail address |
| `EMAIL_PASS` | your-app-password | Gmail App Password (not regular password) |
| `EMAIL_SUBJECT` | Your Certificate is Here! | (Optional) Email subject |
| `EMAIL_BODY` | Dear {name},\n\nPlease find your certificate attached.\n\nBest regards,\nAdmin | (Optional) Email body (use {name} for recipient name) |

**Important**: For Gmail, you need to create an [App Password](https://support.google.com/accounts/answer/185833):
- Go to Google Account → Security → 2-Step Verification → App passwords
- Generate a new app password for "Mail"
- Use this password in `EMAIL_PASS`

### 4. Redeploy
After adding environment variables, trigger a new deployment:
- Go to **Deployments** tab
- Click the three dots on the latest deployment
- Click "Redeploy"

### 5. Get Your Webhook URL
After successful deployment, copy your deployment URL (e.g., `https://certificate-hq.vercel.app`)

### 6. Update Google Form Script
1. Open your Google Form
2. Click the three dots → **Script editor**
3. Paste the content from `google-script.js`
4. Update the URL line:
   ```javascript
   var url = "https://YOUR_VERCEL_PROJECT.vercel.app/webhook";
   ```
   Replace with your actual Vercel URL
5. Save the script (Ctrl+S or Cmd+S)
6. Set up a trigger:
   - Click the clock icon (Triggers)
   - Click "+ Add Trigger"
   - Choose function: `onSubmit`
   - Event type: "On form submit"
   - Click "Save"

### 7. Test
Submit a test response to your Google Form and check if the certificate is sent!

## Troubleshooting

### Build Fails
- Make sure all dependencies are in `package.json`
- Check Vercel build logs for specific errors

### Email Not Sending
- Verify environment variables are set correctly
- Check that you're using a Gmail App Password, not your regular password
- Look at Vercel function logs for error messages

### Webhook Not Triggering
- Verify the URL in Google Script matches your Vercel deployment URL
- Check that the trigger is set up correctly in Google Apps Script
- Test the webhook manually using a tool like Postman

## Local Development
```bash
# Install dependencies
npm install

# Create .env file with your credentials
cp .env.example .env
# Edit .env with your actual credentials

# Run development server
npm run dev

# Test locally
npx ts-node test-webhook.ts
```
