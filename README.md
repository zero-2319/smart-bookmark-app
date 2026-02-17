# Smart Bookmark Manager

A real-time bookmark manager built with Next.js, Supabase, and Tailwind CSS. Users sign in with Google and can manage their personal bookmarks with instant synchronization across multiple tabs.

## 🚀 Live Demo

**Live URL:** https://smart-bookmark-app-inky-five.vercel.app  
**GitHub:** https://github.com/zero-2319/smart-bookmark-app

---

## ✨ Features

- Google OAuth authentication (no email/password)
- Add bookmarks with title and URL
- Private bookmarks per user (Row Level Security)
- Real-time updates across multiple tabs without page refresh
- Delete bookmarks
- Toast notifications for user feedback
- Optimistic UI updates for instant feedback
- Responsive design with dark mode support

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Auth & Database:** Supabase (Auth, PostgreSQL, Realtime)
- **Styling:** Tailwind CSS
- **Deployment:** Vercel
- **Language:** TypeScript

---

## ⚙️ Local Setup

### 1. Clone & Install

```bash
git clone https://github.com/zero-2319/smart-bookmark-app.git
cd smart-bookmark-app
npm install
```

### 2. Supabase Setup

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run this:

```sql
create table public.bookmarks (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  url text not null,
  user_id uuid references auth.users(id) on delete cascade not null
);

alter table public.bookmarks enable row level security;

create policy "Users can view their own bookmarks"
  on public.bookmarks for select using (auth.uid() = user_id);

create policy "Users can insert their own bookmarks"
  on public.bookmarks for insert with check (auth.uid() = user_id);

create policy "Users can delete their own bookmarks"
  on public.bookmarks for delete using (auth.uid() = user_id);

alter publication supabase_realtime add table public.bookmarks;
```

3. Go to **Settings → API** and copy your **Project URL** and **Anon Key**

### 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create an OAuth 2.0 Client ID (Web application)
3. Add this redirect URI: `http://localhost:3000/auth/callback`
4. In Supabase → **Authentication → Providers → Google**
5. Enable Google and paste your Client ID and Client Secret

### 4. Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🚢 Deployment (Vercel)

1. Push your code to a public GitHub repository
2. Go to [vercel.com](https://vercel.com) and import the repo
3. Add environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy and get your live URL
5. Add the Vercel URL to Google OAuth redirect URIs:
   ```
   https://your-app.vercel.app/auth/callback
   ```
6. In Supabase → **Authentication → URL Configuration**:
   - Set **Site URL** to `https://your-app.vercel.app`
   - Add `https://your-app.vercel.app/**` to Redirect URLs

---

## 🐛 Problems I Faced & How I Solved Them

### Problem: Real-Time Updates Not Working Across Tabs

**Issue:** Adding a bookmark in Tab 1 would not appear in Tab 2 without a manual page refresh.

**Debugging process:**
- Added console logs to track subscription status → confirmed `✅ SUBSCRIBED` was showing in both tabs, meaning the WebSocket connection was working
- Confirmed Realtime was already enabled on the table (running the SQL again returned: `relation "bookmarks" is already member of publication "supabase_realtime"`)
- Narrowed it down to the `addBookmark` function — it was doing an **optimistic update** by manually inserting the bookmark into local state immediately, then when the real-time INSERT event fired it was being detected as a duplicate and skipped in Tab 1, and in Tab 2 the event was simply not arriving reliably

**Solution:** Used a hybrid approach — optimistic updates for instant UI feedback in the current tab, and a `localStorage` storage event listener to notify other tabs to re-fetch:

```typescript
// Step 1: Optimistic update for instant feedback in current tab
setBookmarks((current) => [optimisticBookmark, ...current])

// Step 2: Insert into Supabase
await supabase.from('bookmarks').insert([...])

// Step 3: Notify other tabs via localStorage event
localStorage.setItem(`bookmarks_updated_${userId}`, Date.now().toString())

// Step 4: Other tabs listen and re-fetch
window.addEventListener('storage', (e) => {
  if (e.key === `bookmarks_updated_${userId}`) {
    void fetchBookmarks()
  }
})
```

This approach gives the current tab instant feedback while ensuring all other open tabs stay in sync automatically without needing a page refresh.

---

Other than this, the rest of the setup (OAuth, Supabase configuration, Vercel deployment) went smoothly as I already had prior experience working with these tools.

---

## 🔒 Security

- **Row Level Security (RLS)** — users can only read, insert, and delete their own bookmarks
- **Google OAuth** — no passwords stored anywhere
- **HTTP-only cookies** — auth tokens managed securely by Supabase
- **Environment variables** — all sensitive keys kept out of the codebase

---

## 📁 Project Structure

```
smart-bookmark-app/
├── app/
│   ├── auth/
│   │   ├── callback/route.ts      # Handles OAuth callback from Google
│   │   ├── login/route.ts         # Initiates Google OAuth flow
│   │   └── logout/route.ts        # Signs user out and redirects
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Main app page (auth check + render)
├── components/
│   ├── BookmarkManager.tsx        # Core UI with real-time sync logic
│   └── LogoutButton.tsx           # Client-side logout button
├── lib/
│   └── supabase/
│       ├── client.ts              # Browser-side Supabase client
│       ├── server.ts              # Server-side Supabase client
│       └── middleware.ts          # Session refresh helper
├── middleware.ts                  # Runs on every request to refresh auth
├── .env.example                   # Environment variable template
└── README.md
```

---

## 🤖 AI Tools Used

I used Claude (Anthropic) as an AI assistant during development to help scaffold the initial project structure, debug the real-time sync issue, and review code. All architectural decisions and debugging were done by me — the AI helped speed up boilerplate and provided suggestions during troubleshooting.