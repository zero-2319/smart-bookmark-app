# Testing Guide

This guide is for evaluators testing the Smart Bookmark Manager application.

## Live Application

**URL:** [Your Vercel deployment URL will go here]

## What to Test

### 1. Authentication ✅

**Test Google Sign-In:**
1. Visit the live URL
2. Click "Sign in with Google"
3. Authorize with your Google account
4. Verify you're redirected back and see "My Bookmarks" page
5. Verify your email is displayed at the top

**Expected Result:** Successfully signed in and viewing the bookmark manager

### 2. Adding Bookmarks ✅

**Test Add Functionality:**
1. Fill in the "Title" field (e.g., "Google")
2. Fill in the "URL" field (e.g., "google.com")
3. Click "Add Bookmark"
4. The form should clear
5. The bookmark should appear immediately in the list below

**Test URL Auto-formatting:**
1. Add a bookmark with URL "example.com" (no https://)
2. Verify it's saved as "https://example.com"

**Expected Result:** Bookmark appears instantly in the list with formatted URL

### 3. Privacy (Bookmarks are Private) ✅

**Test User Isolation:**
1. Sign in with Account A
2. Add a bookmark
3. Sign out
4. Sign in with Account B
5. Verify you DON'T see Account A's bookmarks
6. Add a different bookmark
7. Sign out and sign back in as Account A
8. Verify you only see Account A's bookmarks, not Account B's

**Expected Result:** Each user only sees their own bookmarks

### 4. Real-Time Updates ✅

**Test Multi-Tab Sync:**
1. Sign in to the app
2. Open the app in a second tab (same browser or different browser)
3. In Tab 1: Add a bookmark
4. In Tab 2: Watch - the bookmark should appear WITHOUT refreshing
5. In Tab 2: Delete a bookmark
6. In Tab 1: Watch - it should disappear WITHOUT refreshing

**Expected Result:** Changes in one tab appear instantly in all other tabs

### 5. Deleting Bookmarks ✅

**Test Delete Functionality:**
1. Hover over a bookmark
2. Click the red trash icon on the right
3. Bookmark should disappear immediately

**Test Multi-Tab Delete:**
1. Open app in two tabs
2. Delete a bookmark in one tab
3. Verify it disappears in both tabs instantly

**Expected Result:** Bookmark is deleted and removed from all active sessions

### 6. Opening Bookmarks ✅

**Test Click to Open:**
1. Click on a bookmark's title or URL
2. The link should open in a new tab
3. The original tab should remain on the bookmark manager

**Expected Result:** Bookmark opens in new tab without navigating away

### 7. Sign Out ✅

**Test Logout:**
1. Click "Sign Out" button
2. Verify you're redirected to the login page
3. Try to navigate to the app URL directly
4. Verify you're redirected back to login

**Expected Result:** Successfully signed out and cannot access bookmarks without re-authenticating

## Test Data Suggestions

Use these test bookmarks to make testing easier:

| Title | URL |
|-------|-----|
| Google | google.com |
| GitHub | github.com |
| Stack Overflow | stackoverflow.com |
| MDN Web Docs | developer.mozilla.org |
| Tailwind CSS | tailwindcss.com |

## Expected Behavior Summary

### ✅ MUST WORK:
- [x] Google OAuth sign-in only (no email/password)
- [x] Add bookmark with title and URL
- [x] Bookmarks are private to each user
- [x] Real-time updates across multiple tabs
- [x] Delete bookmarks
- [x] Deployed on Vercel with working live URL

### ✅ NICE TO HAVE (Already Implemented):
- [x] Auto-format URLs (add https://)
- [x] Click bookmark to open in new tab
- [x] Display timestamp
- [x] Empty state when no bookmarks
- [x] Dark mode support
- [x] Responsive design
- [x] Loading states

## Common Issues & Solutions

### Issue: "OAuth redirect URI mismatch"
**Solution:** The redirect URIs need to be configured in Google Cloud Console. Contact the developer.

### Issue: Bookmarks not appearing
**Solution:** 
- Check browser console for errors
- Verify you're signed in (email shown at top?)
- Try refreshing the page

### Issue: Real-time sync not working
**Solution:**
- Open browser console and check for WebSocket errors
- Ensure both tabs are signed in to the same account
- Try adding a bookmark again

### Issue: Can't sign in
**Solution:**
- Clear browser cookies
- Try incognito/private mode
- Ensure popup blockers aren't blocking the OAuth window

## Performance Testing

**What to Check:**
- Initial page load (should be < 3 seconds)
- Time to add bookmark (should be instant)
- Time for real-time update to appear (should be < 1 second)
- No console errors
- No visual glitches

## Browser Testing

Test on:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Mobile Testing

**Responsive Design:**
1. Open on mobile device or resize browser
2. Verify layout adapts properly
3. Test all functionality works on touch devices
4. Verify forms are usable on mobile

## Security Testing

**Verify:**
1. Can't access bookmarks without signing in
2. Can't see other users' bookmarks
3. Environment variables not exposed in client
4. HTTPS enabled on Vercel deployment

## Evaluation Criteria

Rate the application on:
- **Functionality:** Do all features work as specified?
- **User Experience:** Is it intuitive and easy to use?
- **Performance:** Is it fast and responsive?
- **Code Quality:** Is the code well-organized? (Check GitHub repo)
- **Documentation:** Is the README comprehensive?
- **Problem Solving:** Are the documented problems and solutions valuable?

## Questions for the Developer

Good questions to ask:
1. How did you handle the real-time subscriptions?
2. What was the most challenging part?
3. How did you structure the client/server Supabase instances?
4. How would you scale this for 1 million users?
5. What security considerations did you implement?

---

Happy Testing! 🚀
