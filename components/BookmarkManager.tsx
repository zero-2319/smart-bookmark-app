'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'

interface Bookmark {
  id: string
  title: string
  url: string
  created_at: string
  user_id: string
}

interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
}

export default function BookmarkManager({ userId }: { userId: string }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [newTitle, setNewTitle] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set())
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const supabase = createClient()
  const channelRef = useRef<RealtimeChannel | null>(null)

  // Toast notification helper
  const showToast = useCallback((type: ToastMessage['type'], message: string) => {
    const id = `${Date.now()}-${Math.random()}`
    setToasts(prev => [...prev, { id, type, message }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }, [])

  const fetchBookmarks = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setBookmarks(data || [])
    } catch (error) {
      console.error('Error fetching bookmarks:', error)
      showToast('error', 'Failed to load bookmarks')
    } finally {
      setLoading(false)
    }
  }, [userId, supabase, showToast])

  useEffect(() => {
    void fetchBookmarks()

    // Subscribe to real-time changes
    const channelName = `bookmarks:${userId}`
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setBookmarks((current) => {
              const exists = current.some(b => b.id === payload.new.id)
              if (exists) return current
              return [payload.new as Bookmark, ...current]
            })
          } else if (payload.eventType === 'DELETE') {
            setBookmarks((current) =>
              current.filter((bookmark) => bookmark.id !== payload.old.id)
            )
          } else if (payload.eventType === 'UPDATE') {
            setBookmarks((current) =>
              current.map((bookmark) =>
                bookmark.id === payload.new.id ? (payload.new as Bookmark) : bookmark
              )
            )
          }
        }
      )
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR') {
          console.error('Real-time subscription error. Check Supabase Realtime settings.')
          showToast('error', 'Real-time sync unavailable')
        }
      })

    channelRef.current = channel

    // Listen for cross-tab storage events
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `bookmarks_updated_${userId}`) {
        // Refetch bookmarks when another tab updates them
        void fetchBookmarks()
      }
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
      }
      window.removeEventListener('storage', handleStorageChange)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])



  const addBookmark = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim() || !newUrl.trim()) return

    setAdding(true)

    // Validate and format URL
    let formattedUrl = newUrl.trim()
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl
    }

    // Generate temporary ID for optimistic update
    const tempId = `temp-${Date.now()}`
    const optimisticBookmark: Bookmark = {
      id: tempId,
      title: newTitle.trim(),
      url: formattedUrl,
      user_id: userId,
      created_at: new Date().toISOString(),
    }

    // Optimistic update - add immediately to UI
    setBookmarks((current) => [optimisticBookmark, ...current])

    // Clear form immediately for better UX
    const titleBackup = newTitle
    const urlBackup = newUrl
    setNewTitle('')
    setNewUrl('')

    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .insert([
          {
            title: optimisticBookmark.title,
            url: optimisticBookmark.url,
            user_id: userId,
          },
        ])
        .select()

      if (error) throw error

      // Replace temporary bookmark with real one from database
      if (data && data.length > 0) {
        const realBookmark = data[0] as Bookmark
        setBookmarks((current) =>
          current.map(b => (b.id === tempId ? realBookmark : b))
        )
        // Notify other tabs about the update
        localStorage.setItem(`bookmarks_updated_${userId}`, Date.now().toString())
        showToast('success', 'Bookmark added successfully')
      }
    } catch (error) {
      console.error('Error adding bookmark:', error)

      // Rollback optimistic update on error
      setBookmarks((current) => current.filter(b => b.id !== tempId))

      // Restore form values
      setNewTitle(titleBackup)
      setNewUrl(urlBackup)

      showToast('error', 'Failed to add bookmark. Please try again.')
    } finally {
      setAdding(false)
    }
  }

  const deleteBookmark = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return

    // Add to deleting set for loading state
    setDeletingIds(prev => new Set(prev).add(id))

    // Optimistic update - remove from UI immediately
    const bookmarkBackup = bookmarks.find(b => b.id === id)
    setBookmarks((current) => current.filter(b => b.id !== id))

    try {
      const { error } = await supabase.from('bookmarks').delete().eq('id', id)

      if (error) throw error
      // Notify other tabs about the update
      localStorage.setItem(`bookmarks_updated_${userId}`, Date.now().toString())
      showToast('success', 'Bookmark deleted')
    } catch (error) {
      console.error('Error deleting bookmark:', error)

      // Rollback on error - restore the bookmark
      if (bookmarkBackup) {
        setBookmarks((current) => {
          // Insert back in original position based on created_at
          const newList = [...current, bookmarkBackup]
          return newList.sort((a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )
        })
      }

      showToast('error', 'Failed to delete bookmark')
    } finally {
      setDeletingIds(prev => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }

  const openUrl = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Toast Notifications */}
      <div className="fixed top-6 right-6 z-50 space-y-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-6 py-4 rounded-xl shadow-elegant text-white font-medium animate-scale-in backdrop-blur-lg ${
              toast.type === 'success'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-500 dark:to-teal-500'
                : toast.type === 'error'
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 dark:from-pink-500 dark:to-purple-500'
                  : 'bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-500 dark:to-purple-600'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>

      {/* Add Bookmark Form */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/30 rounded-2xl shadow-elegant p-8 mb-8 hover-lift animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-pink-100 dark:bg-pink-900/30">
            <svg className="w-6 h-6 text-pink-600 dark:text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h2 className="text-2xl font-display font-semibold text-gray-900 dark:text-white">
            Add New Bookmark
          </h2>
        </div>
        <form onSubmit={addBookmark} className="space-y-5">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g., Design Inspiration Hub"
              className="w-full px-5 py-3 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-pink-600 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 shadow-sm"
              required
              disabled={adding}
              aria-label="Bookmark title"
            />
          </div>
          <div>
            <label
              htmlFor="url"
              className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              URL
            </label>
            <input
              type="url"
              id="url"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-5 py-3 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-pink-600 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 shadow-sm"
              required
              disabled={adding}
              aria-label="Bookmark URL"
            />
          </div>
          <button
            type="submit"
            disabled={adding}
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-pink-600/30 hover:shadow-xl hover:shadow-pink-600/40"
            aria-label={adding ? 'Adding bookmark' : 'Add bookmark'}
          >
            {adding ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Adding...
              </span>
            ) : (
              'Add Bookmark'
            )}
          </button>
        </form>
      </div>

      {/* Bookmarks List */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/30 rounded-2xl shadow-elegant p-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
            <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-display font-semibold text-gray-900 dark:text-white">
            Your Bookmarks <span className="text-orange-600 dark:text-orange-400">({bookmarks.length})</span>
          </h2>
        </div>

        {bookmarks.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 dark:from-purple-500/30 dark:to-pink-900/30 flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-pink-600 dark:text-pink-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
              No bookmarks yet
            </h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Get started by adding your first bookmark above.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookmarks.map((bookmark, index) => {
              const isDeleting = deletingIds.has(bookmark.id)
              const isTemp = bookmark.id.startsWith('temp-')

              return (
                <div
                  key={bookmark.id}
                  style={{
                    animation: `fadeIn 0.4s ease-out ${index * 50}ms both`,
                  }}
                  className={`flex items-center justify-between p-5 rounded-xl border border-gray-200 dark:border-slate-700/50 hover:border-pink-300 dark:hover:border-pink-700 transition-all duration-300 group hover-lift ${
                    isDeleting ? 'opacity-50 pointer-events-none' : ''
                  } ${isTemp ? 'bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800' : 'bg-gray-50/50 dark:bg-slate-800/50 hover:bg-pink-50/50 dark:hover:bg-pink-900/20'}`}
                >
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => !isTemp && openUrl(bookmark.url)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !isTemp) openUrl(bookmark.url)
                    }}
                    aria-label={`Open ${bookmark.title}`}
                  >
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors text-lg">
                      {bookmark.title}
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-200 break-all group-hover:text-gray-900 dark:group-hover:text-white transition-colors mt-1">
                      {bookmark.url}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {new Date(bookmark.created_at).toLocaleDateString()} at{' '}
                      {new Date(bookmark.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteBookmark(bookmark.id, bookmark.title)}
                    disabled={isDeleting || isTemp}
                    className="ml-4 p-3 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                    title="Delete bookmark"
                    aria-label={`Delete ${bookmark.title}`}
                  >
                    {isDeleting ? (
                      <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}