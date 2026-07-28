export type Contact = {
  id?: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  topic?: string
  message: string
  created_at?: string
}

export type Comment = {
  id?: string
  post_id: string
  author: string
  text: string
  created_at?: string
}

export type Template = {
  id: string
  name: string
  sections_before: unknown
  sections_after: unknown
}

export type Settings = {
  id: string
  name: string
  data: Record<string, unknown>
}
