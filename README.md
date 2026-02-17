# Smart Bookmark Manager

A real-time bookmark manager built with Next.js, Supabase, and Tailwind CSS. Users can sign in with Google OAuth and manage their personal bookmarks with instant synchronization across multiple tabs.

## 🚀 Live Demo

**Live URL:** [To be deployed on Vercel]

**GitHub Repository:** [https://github.com/yourusername/smart-bookmark-app](https://github.com/yourusername/smart-bookmark-app)

## ✨ Features

- ✅ Google OAuth authentication (no email/password)
- ✅ Add bookmarks with title and URL
- ✅ Private bookmarks per user
- ✅ Real-time updates across multiple tabs
- ✅ Delete bookmarks
- ✅ Responsive design with dark mode support
- ✅ Auto-format URLs (adds https:// if missing)
- ✅ Click on bookmark to open in new tab

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Authentication & Database:** Supabase (Auth, PostgreSQL, Realtime)
- **Styling:** Tailwind CSS
- **Deployment:** Vercel
- **Language:** TypeScript

## 📋 Prerequisites

- Node.js 18+ installed
- A Supabase account
- A Google Cloud Console project with OAuth credentials
- A Vercel account (for deployment)

## 🏗️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/smart-bookmark-app.git
cd smart-bookmark-app
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run this schema:

```sql
-- Create bookmarks table
create table public.bookmarks (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  url text not null,
  user_id uuid references auth.users(id) on delete cascade not null
);

-- Enable Row Level Security
alter table public.bookmarks enable row level security;

-- Create policies
create policy "Users can view their own bookmarks"
  on public.bookmarks for select
  using (auth.uid() = user_id);

create policy "Users can insert their own bookmarks"
  on public.bookmarks for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own bookmarks"
  on public.bookmarks for delete
  using (auth.uid() = user_id);

-- Enable Realtime
alter publication supabase_realtime add table public.bookmarks;
```

3. Go to **Project Settings > API** and copy:
   - Project URL
   - Anon/Public key

### 3. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable **Google+ API**
4. Go to **Credentials > Create Credentials > OAuth 2.0 Client ID**
5. Configure OAuth consent screen
6. Create OAuth 2.0 Client ID:
   - Application type: Web application
   - Authorized redirect URIs:
     - `http://localhost:3000/auth/callback` (for development)
     - `https://your-supabase-project.supabase.co/auth/v1/callback` (for production)
7. Copy Client ID and Client Secret

8. In Supabase:
   - Go to **Authentication > Providers > Google**
   - Enable Google provider
   - Paste Client ID and Client Secret
   - Save

### 4. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 6. Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Update Google OAuth redirect URI:
   - Add `https://your-vercel-app.vercel.app/auth/callback`
6. Deploy!

## 🧪 Testing

1. Sign in with your Google account
2. Add a bookmark
3. Open the app in another tab - the bookmark should appear instantly
4. Delete a bookmark in one tab - it disappears in both
5. Sign out and verify you cannot access bookmarks

## 🐛 Problems Encountered & Solutions

### Problem 1: Real-time Subscriptions Not Working

**Issue:** Initially, the real-time updates weren't triggering when bookmarks were added or deleted.

**Solution:** 
- Needed to enable Realtime on the `bookmarks` table using `alter publication supabase_realtime add table public.bookmarks;`
- Ensured the channel subscription filter was correctly set to the user's ID: `filter: 'user_id=eq.${userId}'`
- The real-time subscription must be set up in a client component (`'use client'`)

### Problem 2: Row Level Security (RLS) Blocking Access

**Issue:** Users couldn't see their bookmarks even after signing in because RLS policies were blocking access.

**Solution:**
- Created specific RLS policies for SELECT, INSERT, and DELETE operations
- Policies use `auth.uid()` to compare with `user_id` column
- Made sure the `user_id` is properly set when inserting new bookmarks

### Problem 3: OAuth Callback URL Issues

**Issue:** After Google authentication, users were getting errors or redirected to wrong URLs.

**Solution:**
- Used Next.js middleware to handle session refresh properly
- Created a dedicated `/auth/callback` route that exchanges the OAuth code for a session
- Handled both local development and production environments with conditional redirects
- Made sure to add all necessary redirect URLs in both Google Console and Supabase

### Problem 4: Server/Client Component Confusion

**Issue:** Mixing server and client components caused hydration errors and auth state issues.

**Solution:**
- Separated Supabase client creation into `lib/supabase/client.ts` (for client components) and `lib/supabase/server.ts` (for server components)
- Used `'use client'` directive explicitly for components that need interactivity or hooks
- Server components handle initial auth check and data fetching
- Client components handle real-time subscriptions and mutations

### Problem 5: Cookie Management in App Router

**Issue:** Authentication cookies weren't being properly set or refreshed, causing users to appear logged out.

**Solution:**
- Implemented proper cookie handling in middleware using `@supabase/ssr`
- Created `middleware.ts` that runs on every request to refresh auth sessions
- Used the async cookies API from Next.js 15: `await cookies()`

### Problem 6: URL Validation and Formatting

**Issue:** Users could enter invalid URLs or URLs without protocol, breaking the link functionality.

**Solution:**
- Added automatic URL formatting that prepends `https://` if no protocol is specified
- Used HTML5 `type="url"` validation for basic format checking
- Trimmed whitespace from inputs before saving

### Problem 7: Dark Mode Flickering

**Issue:** Dark mode preference wasn't being applied immediately, causing a flash of light theme.

**Solution:**
- Used Tailwind's `dark:` variant which respects system preferences automatically
- Applied dark mode classes at the root level in `globals.css`
- No client-side theme toggle needed - relies on OS preference

## 🔒 Security Considerations

- Row Level Security (RLS) ensures users can only access their own bookmarks
- Google OAuth provides secure authentication without managing passwords
- Environment variables keep sensitive keys out of the codebase
- Supabase handles all auth token management and refresh automatically

## 📁 Project Structure

```
smart-bookmark-app/
├── app/
│   ├── auth/
│   │   ├── callback/
│   │   │   └── route.ts          # OAuth callback handler
│   │   ├── login/
│   │   │   └── route.ts          # Login route
│   │   └── logout/
│   │       └── route.ts          # Logout route
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/
│   ├── BookmarkManager.tsx       # Main bookmark component
│   └── LogoutButton.tsx          # Logout button
├── lib/
│   └── supabase/
│       ├── client.ts             # Client-side Supabase
│       ├── server.ts             # Server-side Supabase
│       └── middleware.ts         # Middleware helper
├── middleware.ts                 # Next.js middleware
├── .env.example                  # Environment variables template
├── .env.local                    # Environment variables (gitignored)
├── package.json
└── README.md
```

## 🚀 Future Enhancements

- [ ] Add tags/categories for bookmarks
- [ ] Search and filter functionality
- [ ] Import/export bookmarks
- [ ] Browser extension
- [ ] Bookmark folders/collections
- [ ] Share bookmarks with other users
- [ ] Bookmark screenshots/previews

## 📝 License

MIT License - feel free to use this project for learning or as a template for your own applications.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

Built with ❤️ using Next.js and Supabase
