import type { ResourceKey } from './types'

export function resourceKeyToString(key: ResourceKey) {
  if (key.variant) {
    return `${key.id}_${key.variant}`
  } else {
    return key.id
  }
}

export function logger(...args: any[]) {
  console.info('[RM]', ...args)
}
