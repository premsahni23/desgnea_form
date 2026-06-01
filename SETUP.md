# Desgnea Application Form — Deployment Guide

No Google Cloud account needed. This uses Google Apps Script (free, built into Google Sheets).

---

## Step 1 — Add the Apps Script to your Google Sheet

1. Open your sheet: https://docs.google.com/spreadsheets/d/1LKzqOw3ec44EeMBleJvWRf-9l_ThPHzddaP_1dkDuuU/edit
2. Click **Extensions → Apps Script**
3. Delete everything in the editor
4. Copy the entire contents of `google-apps-script.js` and paste it in
5. Click **Save** (the floppy disk icon or Ctrl+S)

---

## Step 2 — Deploy the Apps Script as a Web App

1. Click **Deploy → New Deployment**
2. Click the gear icon ⚙️ next to "Type" and select **Web App**
3. Set:
   - **Description**: Desgnea Form Handler
   - **Execute as**: Me
   - **Who has access**: Anyone
4. Click **Deploy**
5. Click **Authorize access** and allow the permissions (it's your own script accessing your own sheet)
6. **Copy the Web App URL** — it looks like:
   ```
   https://script.google.com/macros/s/AKfycb.../exec
   ```
   Keep this URL — you'll need it in Step 4.

---

## Step 3 — Deploy to Vercel

### Option A — Vercel CLI

```bash
npm install -g vercel
vercel
```

Follow the prompts and accept the defaults.

### Option B — Vercel Dashboard (no CLI needed)

1. Push this repo to GitHub (it's already at https://github.com/premsahni23/desgnea_form)
2. Go to https://vercel.com → **Add New Project**
3. Import the `desgnea_form` GitHub repository
4. Click **Deploy** (no build settings needed)

---

## Step 4 — Add the Environment Variable in Vercel

1. In your Vercel project, go to **Settings → Environment Variables**
2. Add one variable:

   | Name | Value |
   |------|-------|
   | `APPS_SCRIPT_URL` | The Web App URL you copied in Step 2 |

3. Click **Save**
4. Go to **Deployments** and click **Redeploy** on the latest deployment

---

## That's it!

Every form submission will now appear as a new row in your Google Sheet with a timestamp.

**To download as Excel:** File → Download → Microsoft Excel (.xlsx)

---

## Troubleshooting

**Submissions not appearing in the sheet?**
- Make sure "Who has access" is set to **Anyone** (not "Anyone with Google account")
- Re-deploy the Apps Script after any changes (Deploy → Manage Deployments → create new version)
- Check the Vercel function logs: Vercel Dashboard → your project → Functions tab

**Getting a 500 error on submit?**
- Verify `APPS_SCRIPT_URL` is set correctly in Vercel environment variables
- Make sure you redeployed after adding the variable
