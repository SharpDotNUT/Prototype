export interface StaticResourceMetaRecord {
  id: string
  ext: string
  descriptions?: { [lang: string]: string }
  externalUrl?: string
  hasVariants?: boolean
  variants?: string[]
  hash: string
  updatedAt: number
}

export interface StaticResourceMeta {
  updatedAt: number
  resources: Record<string, StaticResourceMetaRecord>
}

export interface CacheResourceRecord {
  id: string
  variant?: string
  size: number
  hash: string
  updatedAt: number
  lastAccess: number
}

export interface ResourceKey {
  id: string
  variant?: string
}
