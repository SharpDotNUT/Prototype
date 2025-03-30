export type t_UpdateLog = Array<{
  version: string
  date: string
  'name-zh'?: string
  'name-en'?: string
  items: Array<{
    area: string
    type: 'UI & UX' | 'Bug Fix' | 'Feature' | 'Performance' | 'Others'
    'content-zh': string
    'content-en': string
  }>
  commits?: Array<string>
}>
