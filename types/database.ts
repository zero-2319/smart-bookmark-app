export interface Bookmark {
  id: string
  created_at: string
  title: string
  url: string
  user_id: string
}

export interface Database {
  public: {
    Tables: {
      bookmarks: {
        Row: Bookmark
        Insert: Omit<Bookmark, 'id' | 'created_at'>
        Update: Partial<Omit<Bookmark, 'id' | 'created_at'>>
      }
    }
  }
}
