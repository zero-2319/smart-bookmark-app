'use client'

export default function LogoutButton() {
  const handleLogout = async () => {
    await fetch('/auth/logout', {
      method: 'POST',
    })
    window.location.href = '/'
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-slate-800 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition-all duration-300 border border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      Sign Out
    </button>
  )
}
