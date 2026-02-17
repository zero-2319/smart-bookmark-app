# Deployment Checklist

Use this checklist to ensure everything is properly configured before submitting.

## Pre-Deployment

### Supabase Setup
- [ ] Created Supabase project
- [ ] Executed `supabase-schema.sql` in SQL Editor
- [ ] Verified `bookmarks` table exists
- [ ] Verified RLS is enabled
- [ ] Verified Realtime is enabled on table
- [ ] Copied Project URL
- [ ] Copied Anon Key

### Google OAuth Setup
- [ ] Created Google Cloud Project
- [ ] Enabled Google+ API
- [ ] Created OAuth 2.0 Client ID
- [ ] Added `http://localhost:3000/auth/callback` to redirect URIs
- [ ] Added Supabase callback URL to redirect URIs
- [ ] Copied Client ID
- [ ] Copied Client Secret
- [ ] Configured OAuth in Supabase (Auth > Providers > Google)

### Local Testing
- [ ] `.env.local` file created with correct values
- [ ] `npm install` completed successfully
- [ ] `npm run dev` runs without errors
- [ ] Can sign in with Google
- [ ] Can add bookmarks
- [ ] Can delete bookmarks
- [ ] Real-time sync works (tested with 2 tabs)
- [ ] Sign out works
- [ ] No console errors

### Code Quality
- [ ] All files committed to Git
- [ ] `.env.local` is in `.gitignore` (NOT committed)
- [ ] README.md is complete
- [ ] No TODO comments left in code
- [ ] TypeScript compiles without errors
- [ ] ESLint passes (run `npm run lint`)

## Deployment

### GitHub
- [ ] Created public GitHub repository
- [ ] Pushed all code to main branch
- [ ] Repository is public (not private)
- [ ] README is visible on GitHub

### Vercel
- [ ] Signed up for Vercel account
- [ ] Connected GitHub account
- [ ] Imported the repository
- [ ] Added environment variables:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Deployment succeeded (build passed)
- [ ] Got deployment URL
- [ ] Visited deployment URL - app loads

### Post-Deployment Configuration
- [ ] Added Vercel URL to Google OAuth redirect URIs
  - Format: `https://your-app.vercel.app/auth/callback`
- [ ] Updated Supabase Site URL to Vercel URL
- [ ] Added Vercel URL to Supabase redirect URLs

## Production Testing

### Functionality Tests
- [ ] Visited live Vercel URL
- [ ] Sign in with Google works
- [ ] Can add a bookmark
- [ ] Bookmark appears immediately
- [ ] Opened second tab - bookmark syncs in real-time
- [ ] Can delete bookmark
- [ ] Deletion syncs across tabs
- [ ] Sign out works
- [ ] Redirected to login after sign out

### Cross-Browser Testing
- [ ] Tested in Chrome/Edge
- [ ] Tested in Firefox
- [ ] Tested in Safari (if available)
- [ ] Tested on mobile browser

### Privacy Test
- [ ] Signed in with Account A
- [ ] Added bookmarks
- [ ] Signed out
- [ ] Signed in with Account B
- [ ] Confirmed Account A's bookmarks NOT visible
- [ ] Added different bookmarks
- [ ] Signed back in as Account A
- [ ] Confirmed only Account A's bookmarks visible

### Performance Check
- [ ] Page loads in < 3 seconds
- [ ] No console errors
- [ ] Real-time updates appear instantly
- [ ] No visual glitches
- [ ] Mobile responsive

## Submission

### Required Items
- [ ] Live Vercel URL (tested and working)
- [ ] GitHub repository URL (public)
- [ ] README.md includes:
  - [ ] Setup instructions
  - [ ] Tech stack
  - [ ] Features list
  - [ ] Problems encountered section
  - [ ] Solutions to problems
  - [ ] Deployment instructions

### Optional Enhancements (Already Included)
- [ ] DEPLOYMENT.md guide
- [ ] QUICKSTART.md for fast setup
- [ ] TESTING.md for evaluators
- [ ] ARCHITECTURE.md documentation
- [ ] CONTRIBUTING.md guide
- [ ] TypeScript types defined
- [ ] Dark mode support
- [ ] Error page for auth failures
- [ ] Loading states
- [ ] Empty states
- [ ] Auto-format URLs

## Final Verification

### Test with Fresh Account
- [ ] Ask a friend to test with their Google account
- [ ] Verify they can sign in
- [ ] Verify they can use all features
- [ ] Verify they don't see any other user's data

### Documentation Review
- [ ] README is clear and comprehensive
- [ ] Problems and solutions are detailed
- [ ] Setup instructions are accurate
- [ ] All URLs are correct (no placeholders)

### Quality Check
- [ ] No broken links in documentation
- [ ] No typos in README
- [ ] Code is clean and well-commented
- [ ] Project looks professional

## Pre-Submission Questions

Ask yourself:
1. ✅ Can someone follow my README and get this running?
2. ✅ Did I document the actual problems I faced?
3. ✅ Are my solutions detailed and helpful?
4. ✅ Would I be proud to show this to other developers?
5. ✅ Does the live app work perfectly?

## Common Issues Before Submission

### Issue: Deployment works locally but not on Vercel
- Check environment variables are set in Vercel
- Verify Vercel URL is added to OAuth redirect URIs
- Check Vercel build logs for errors

### Issue: Real-time not working in production
- Verify Realtime is enabled in Supabase
- Check browser console for WebSocket errors
- Ensure WebSocket connections aren't blocked

### Issue: Google OAuth fails in production
- Verify all redirect URIs are correct
- Check Supabase callback URL is added
- Ensure OAuth credentials are correct in Supabase

## Ready to Submit!

If all items are checked, you're ready to submit:

**Submission Items:**
1. Live Vercel URL: `_______________________`
2. GitHub Repo: `_______________________`

**Double-Check One Last Time:**
- [ ] Live URL works
- [ ] GitHub repo is public
- [ ] README has problems & solutions section
- [ ] Can sign in, add, delete, and see real-time sync

**Good luck! 🚀**
