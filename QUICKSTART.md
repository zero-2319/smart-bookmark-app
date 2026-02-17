# Quick Start Guide

Get the Smart Bookmark Manager running in under 10 minutes!

## 1. Clone & Install (1 min)

```bash
git clone https://github.com/yourusername/smart-bookmark-app.git
cd smart-bookmark-app
npm install
```

## 2. Supabase Setup (3 min)

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to SQL Editor, paste this:

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

4. Run it!
5. Go to Settings > API, copy URL and Anon Key

## 3. Google OAuth Setup (3 min)

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create project
3. Go to APIs & Services > Credentials
4. Create OAuth 2.0 Client ID
5. Add redirect URI: `http://localhost:3000/auth/callback`
6. Copy Client ID & Secret

7. In Supabase:
   - Go to Authentication > Providers > Google
   - Paste Client ID & Secret
   - Enable it

## 4. Environment Setup (1 min)

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## 5. Run! (1 min)

```bash
npm run dev
```

Open http://localhost:3000

## 6. Deploy to Vercel (2 min)

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repo
4. Add environment variables
5. Deploy!
6. Update Google OAuth redirect URI with Vercel URL

## Done! 🎉

Now test:
- Sign in with Google
- Add a bookmark
- Open another tab - see it appear instantly!

## Need Help?

- Full setup: See `README.md`
- Deployment: See `DEPLOYMENT.md`
- Database schema: See `supabase-schema.sql`
