# Deployment Guide - Fixing Vercel Build Issues

## Issues Fixed

### 1. React Version Conflict
- **Problem**: React 19.1.0 is not compatible with react-table 7.8.0
- **Solution**: Downgraded to React 18.3.1 and React DOM 18.3.1

### 2. Environment Variables
- **Problem**: Backend URL not configured in Vercel
- **Solution**: Need to set `BACKEND_URL` environment variable

### 3. ESLint Errors
- **Problem**: Build failing due to ESLint errors (unescaped entities, TypeScript any types)
- **Solution**: Fixed unescaped apostrophe and added proper TypeScript types

## Steps to Deploy Successfully

### Step 1: Update Dependencies (Already Done)
The package.json has been updated with:
- React: `^18.3.1`
- React DOM: `^18.3.1`
- React Types: `^18`

### Step 2: Fix ESLint Errors (Already Done)
The following ESLint errors have been fixed:
- Fixed unescaped apostrophe in PortfolioSummary.tsx (`Today's` → `Today&apos;s`)
- Removed `any` type in PortfolioTable.tsx (proper typing for header click handler)
- Added proper TypeScript types for CustomTooltip in StockChart.tsx

### Step 3: Configure Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project (8byte)
3. Go to Settings → Environment Variables
4. Add the following environment variable:
   - **Name**: `BACKEND_URL`
   - **Value**: Your Railway backend URL (e.g., `https://your-app-name.railway.app`)
   - **Environment**: Production (and Preview if needed)

### Step 4: Redeploy

1. In Vercel dashboard, go to Deployments
2. Click "Redeploy" on your latest deployment
3. Or push a new commit to trigger automatic deployment

## Railway Configuration

Your Railway configuration looks good:
```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "build": {
    "builder": "RAILPACK"
  },
  "deploy": {
    "runtime": "V2",
    "numReplicas": 1,
    "sleepApplication": false,
    "useLegacyStacker": false,
    "multiRegionConfig": {
      "asia-southeast1-eqsg3a": {
        "numReplicas": 1
      }
    },
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

## Testing the Deployment

After deployment:
1. Check that your frontend loads without errors
2. Verify that the portfolio data loads correctly
3. Test the refresh functionality
4. Ensure the backend connection works (check browser network tab)

## Troubleshooting

If you still encounter issues:

1. **Check Vercel Build Logs**: Look for any remaining dependency conflicts
2. **Verify Environment Variables**: Ensure `BACKEND_URL` is set correctly
3. **Test Backend**: Make sure your Railway backend is running and accessible
4. **Clear Cache**: Try clearing Vercel's build cache

## Alternative Solutions

If you want to keep React 19, you could:
1. Use a different table library that supports React 19
2. Wait for react-table to add React 19 support
3. Use a fork or alternative implementation

However, React 18.3.1 is stable and widely supported, so the current solution should work perfectly for your portfolio dashboard.
