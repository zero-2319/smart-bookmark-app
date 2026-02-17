import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import BookmarkManager from '@/components/BookmarkManager'
import LogoutButton from '@/components/LogoutButton'

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 flex items-center justify-center overflow-hidden">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-40 left-40 w-80 h-80 bg-pink-600/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 px-4 w-full max-w-md">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/30 rounded-2xl shadow-elegant p-10 animate-fade-in">
            {/* Logo/Icon */}
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-pink-600/30">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
            </div>

            {/* Content */}
            <div className="text-center mb-10">
              <h1 className="gradient-text font-display text-4xl font-bold mb-3">
                Smart Bookmark Manager
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-base font-light leading-relaxed">
                Curate, organize, and access your digital inspiration effortlessly
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                Sign in to get started with bookmarking
              </p>
            </div>
            
            <form action="/auth/login" method="post" className="space-y-4">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white rounded-xl px-6 py-4 font-semibold transition-all duration-300 shadow-lg shadow-pink-600/30 hover:shadow-xl hover:shadow-pink-600/40 hover-lift group"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-slate-700"></div>
                </div>
              </div>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-700">
              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                <span className="block mb-2">🔒 Secure login with Google OAuth</span>
                Your bookmarks are private and secure
              </p>
            </div>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-lg border border-white/20 dark:border-slate-700/30 rounded-lg p-4 text-center animate-fade-in" style={{animationDelay: '0.1s'}}>
              <div className="text-2xl mb-2">💾</div>
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Save Links</p>
            </div>
            <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-lg border border-white/20 dark:border-slate-700/30 rounded-lg p-4 text-center animate-fade-in" style={{animationDelay: '0.2s'}}>
              <div className="text-2xl mb-2">🔄</div>
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Real-time Sync</p>
            </div>
            <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-lg border border-white/20 dark:border-slate-700/30 rounded-lg p-4 text-center animate-fade-in" style={{animationDelay: '0.3s'}}>
              <div className="text-2xl mb-2">🌐</div>
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Access Anywhere</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 left-40 w-80 h-80 bg-pink-600/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-5xl">
        <div className="mb-12">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/30 rounded-2xl shadow-elegant dark:shadow-none p-8 mb-8 animate-fade-in">
            <div className="flex justify-between items-start gap-6">
              <div className="flex-1">
                <h1 className="gradient-text text-4xl md:text-5xl font-display font-bold mb-2">
                  Smart Bookmark Manager
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-lg font-light">
                  Curate, organize, and access your digital inspiration effortlessly
                </p>
                <div className="flex items-center gap-3 mt-4">
                  {user.user_metadata?.avatar_url && (
                    <img 
                      src={user.user_metadata.avatar_url} 
                      alt="Profile" 
                      className="w-10 h-10 rounded-full border-2 border-pink-600"
                    />
                  )}
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Signed in as <span className="font-semibold text-indigo-600 dark:text-indigo-400">{user.email}</span>
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0">
                <LogoutButton />
              </div>
            </div>
          </div>
        </div>

        <BookmarkManager userId={user.id} />
      </div>
    </div>
  )
}
