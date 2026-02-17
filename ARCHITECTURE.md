# Architecture Documentation

## System Overview

The Smart Bookmark Manager is a full-stack web application built with modern technologies that provides real-time bookmark synchronization across multiple devices and browser tabs.

## Technology Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling

### Backend
- **Supabase** - Backend-as-a-Service
  - Authentication (Google OAuth)
  - PostgreSQL Database
  - Row Level Security (RLS)
  - Realtime subscriptions
- **Next.js API Routes** - Server-side handlers

### Deployment
- **Vercel** - Hosting and CI/CD

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                  Next.js Frontend                     │  │
│  │  ┌────────────┐  ┌──────────────┐  ┌─────────────┐  │  │
│  │  │   Login    │  │   Bookmark   │  │   Logout    │  │  │
│  │  │    Page    │  │   Manager    │  │   Button    │  │  │
│  │  └────────────┘  └──────────────┘  └─────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/WebSocket
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Vercel Edge Network                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Next.js Middleware                       │  │
│  │           (Session Management)                        │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              API Routes                               │  │
│  │    /auth/login  /auth/logout  /auth/callback         │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ REST API / WebSocket
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Supabase Platform                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │     Auth     │  │   Database   │  │   Realtime   │     │
│  │  (Google     │  │ (PostgreSQL) │  │ (WebSocket)  │     │
│  │   OAuth)     │  │              │  │              │     │
│  │              │  │  Bookmarks   │  │  Pub/Sub     │     │
│  │              │  │    Table     │  │  Channel     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### Authentication Flow

1. User clicks "Sign in with Google"
2. POST request to `/auth/login`
3. Server initiates OAuth flow with Supabase
4. Redirect to Google's consent screen
5. User authorizes application
6. Google redirects to `/auth/callback` with code
7. Exchange code for session token
8. Set secure HTTP-only cookie
9. Redirect to home page

### Add Bookmark Flow

1. User fills form and clicks "Add Bookmark"
2. Client calls `supabase.from('bookmarks').insert()`
3. Supabase validates user session
4. RLS policy checks user_id matches auth.uid()
5. Record inserted into database
6. Database triggers Realtime notification
7. All connected clients receive update via WebSocket
8. UI updates instantly without refresh

### Real-time Sync Flow

1. Component mounts and subscribes to Realtime channel
2. Filter: `user_id=eq.${userId}`
3. Listen for INSERT, UPDATE, DELETE events
4. On event received:
   - Parse payload
   - Update local state
   - React re-renders component
5. On unmount: Unsubscribe from channel

## Database Schema

```sql
Table: bookmarks
┌──────────────┬──────────────────────────┬──────────────┐
│ Column       │ Type                     │ Constraints  │
├──────────────┼──────────────────────────┼──────────────┤
│ id           │ uuid                     │ PRIMARY KEY  │
│ created_at   │ timestamp with time zone │ NOT NULL     │
│ title        │ text                     │ NOT NULL     │
│ url          │ text                     │ NOT NULL     │
│ user_id      │ uuid                     │ FK, NOT NULL │
└──────────────┴──────────────────────────┴──────────────┘

Indexes:
- bookmarks_user_id_idx on (user_id)
- bookmarks_created_at_idx on (created_at DESC)

Row Level Security Policies:
1. SELECT: auth.uid() = user_id
2. INSERT: auth.uid() = user_id
3. DELETE: auth.uid() = user_id
```

## Security Architecture

### Authentication
- OAuth 2.0 with Google (no password storage)
- JWT tokens managed by Supabase
- Secure HTTP-only cookies
- Automatic token refresh via middleware

### Authorization
- Row Level Security (RLS) on database
- Server-side session validation
- Client-side auth state sync
- Protected routes via middleware

### Data Privacy
- User can only access own bookmarks
- No shared data between users
- Encrypted connections (HTTPS/WSS)
- Environment variables for secrets

## File Structure

```
smart-bookmark-app/
├── app/                          # Next.js App Router
│   ├── auth/
│   │   ├── callback/
│   │   │   └── route.ts         # OAuth callback handler
│   │   ├── login/
│   │   │   └── route.ts         # Login endpoint
│   │   ├── logout/
│   │   │   └── route.ts         # Logout endpoint
│   │   └── auth-code-error/
│   │       └── page.tsx         # Error page
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page (main app)
│
├── components/
│   ├── BookmarkManager.tsx      # Main bookmark UI (client)
│   └── LogoutButton.tsx         # Logout component (client)
│
├── lib/
│   └── supabase/
│       ├── client.ts            # Browser Supabase client
│       ├── server.ts            # Server Supabase client
│       └── middleware.ts        # Middleware helper
│
├── types/
│   └── database.ts              # TypeScript types
│
├── middleware.ts                # Next.js middleware
├── next.config.js               # Next.js configuration
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies
```

## Component Architecture

### Server Components
- `app/page.tsx` - Fetches initial auth state
- Uses `lib/supabase/server.ts`
- Renders based on auth state
- No interactivity

### Client Components
- `BookmarkManager.tsx` - Interactive bookmark CRUD
- `LogoutButton.tsx` - Logout action
- Use `lib/supabase/client.ts`
- Subscribe to Realtime
- Handle user interactions

## State Management

### Server State
- User authentication state
- Initial data fetch
- Managed by Supabase

### Client State
- Bookmarks array (local copy)
- Form inputs (title, url)
- Loading states
- Managed by React useState

### Real-time Sync
- WebSocket connection to Supabase
- Event-driven updates
- Optimistic UI updates
- Conflict resolution: last-write-wins

## Performance Optimizations

### Frontend
- Server-side rendering (SSR)
- Code splitting (automatic with Next.js)
- Optimistic UI updates
- Minimal re-renders

### Database
- Indexed user_id column
- Indexed created_at column
- RLS for query filtering
- Connection pooling (Supabase)

### Deployment
- Edge network (Vercel)
- Automatic caching
- Serverless functions
- CDN for static assets

## Scalability Considerations

### Current Limits (Free Tier)
- Supabase: 50,000 monthly active users
- Vercel: 100GB bandwidth/month
- Realtime: 200 concurrent connections

### Scaling Strategy
1. **Database**: Increase Supabase tier for more connections
2. **Realtime**: Use Supabase Realtime scaling
3. **API**: Serverless auto-scales
4. **Frontend**: CDN handles high traffic

### Future Enhancements
- Redis cache for frequent queries
- Database read replicas
- Message queue for background jobs
- Rate limiting
- Pagination for large bookmark lists

## Monitoring & Debugging

### Logs
- Vercel function logs
- Supabase database logs
- Browser console (dev mode)

### Metrics
- Authentication success rate
- API response times
- WebSocket connection stability
- Error rates

### Error Handling
- Client-side: Try-catch with user feedback
- Server-side: Error responses with codes
- Auth errors: Redirect to error page
- Database errors: Console logging

## Development Workflow

1. Local development: `npm run dev`
2. Make changes
3. Test locally
4. Commit to Git
5. Push to GitHub
6. Vercel auto-deploys
7. Test on production URL

## Testing Strategy

### Manual Testing
- Authentication flow
- CRUD operations
- Real-time sync
- Multi-tab behavior
- Different browsers
- Mobile responsive

### Areas for Automated Testing (Future)
- Unit tests (components)
- Integration tests (API routes)
- E2E tests (Playwright/Cypress)
- Load testing (k6)

## Conclusion

This architecture provides:
- ✅ Secure authentication
- ✅ Private data per user
- ✅ Real-time synchronization
- ✅ Scalable foundation
- ✅ Developer-friendly
- ✅ Production-ready

The design prioritizes simplicity while maintaining professional standards and room for growth.
