# Soko Corner: e-commerce site with M-Pesa (STK Push)

A simple shop that sells goods and services and takes payment by M-Pesa.
Plain HTML, CSS and JavaScript, plus three small serverless functions for the Daraja API.

## Files
| File | What it does |
|---|---|
| `index.html` | The page |
| `styles.css` | Look and feel |
| `products.js` | **Edit this** to change products, prices and icons |
| `app.js` | Cart, checkout, payment flow |
| `api/stkpush.js` | Sends the M-Pesa PIN prompt |
| `api/status.js` | Checks whether the customer paid |
| `api/callback.js` | Receives Safaricom's result |

## Step 1: Put it on GitHub
1. On github.com click **New repository** (name it e.g. `soko-corner`, set it to Public).
2. Click **uploading an existing file**, drag in everything from this folder (keep the `api` folder), then **Commit changes**.

## Step 2a: Quick shareable link (demo mode)
**Settings → Pages → Deploy from a branch → `main` / root → Save.**
Your link appears in a minute: `https://YOUR-USERNAME.github.io/soko-corner/`.
GitHub Pages cannot run the `api` folder, so checkout **simulates** the payment. Good for showing the design.

## Step 2b: Real sandbox payments (use this for your assignment demo)
1. Get credentials at developer.safaricom.co.ke: **My Apps → Add a new app** (tick the sandbox M-Pesa options) and copy the Consumer Key and Secret. Under **APIs → M-Pesa Express → Simulate** copy the sandbox **Passkey**. The test shortcode is `174379`.
2. Go to vercel.com, sign in with GitHub, click **Add New → Project**, and import your repo.
3. Before deploying, open **Environment Variables** and add the five names from `.env.example` with your values.
4. Click **Deploy**. Vercel gives you a link like `https://soko-corner.vercel.app`. Share that link.
5. Open the link, add items, click **Pay with M-Pesa**, and use the sandbox test number `254708374149`.

**Good to know:** the sandbox does not ring real phones. Success or failure shows up in the API response and in Vercel's **Logs** tab (callback). For real payments, apply for Go Live in Daraja, get a real Paybill or Till, and set `MPESA_ENV=production` with your live credentials.

Never commit real keys. Keep them in Vercel's environment variables only.
