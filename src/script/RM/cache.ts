// 导入类型定义和工具函数
import type { CacheResourceRecord, StaticResourceMetaRecord } from './types'
import { resourceKeyToString } from './utils'

// 定义缓存元数据类
class CacheMeta {
  private StorageKey = 'CacheMetaManager'
  // 定义缓存元数据记录
  private CacheMeta: Record<string, CacheResourceRecord> = {}
  constructor() {
    const cacheMeta = localStorage.getItem(this.StorageKey)
    if (cacheMeta) {
      this.CacheMeta = JSON.parse(cacheMeta)
    }
  }
  private save() {
    localStorage.setItem(this.StorageKey, JSON.stringify(this.CacheMeta))
  }
  // 判断缓存中是否存在指定key
  exist(key: string) {
    return !!this.CacheMeta[key]
  }
  // 获取指定key的缓存元数据
  get(key: string) {
    this.CacheMeta[key].lastAccess = Date.now()
    this.save()
    return this.CacheMeta[key]
  }
  // 设置指定key的缓存元数据
  set(
    key: string,
    res: StaticResourceMetaRecord,
    variant: string | undefined,
    size: number
  ) {
    this.CacheMeta[key] = {
      id: res.id,
      variant: variant,
      size: size,
      hash: res.hash,
      updatedAt: res.updatedAt,
      lastAccess: Date.now()
    }
    this.save()
    return this.CacheMeta[key]
  }
  delete(key: string) {
    delete this.CacheMeta[key]
    this.save()
  }
  async getAllMeta() {
    const totalSize = Object.values(this.CacheMeta).reduce(
      (acc, cur) => acc + cur.size,
      0
    )
    const { quota, usage } = await navigator.storage.estimate()
    return {
      total: quota,
      used: usage,
      cacheUsed: totalSize,
      resources: this.CacheMeta
    }
  }
}

// 定义缓存管理类
class CacheManager {
  // 定义缓存对象
  private cache: Cache | undefined
  // 定义缓存元数据对象
  private meta = new CacheMeta()

  // 构造函数，传入缓存名称
  constructor(CacheName: string) {
    // 打开缓存
    caches.open(CacheName).then((cache) => {
      this.cache = cache
    })
  }

  getResource(ResMeta: StaticResourceMetaRecord, variant?: string) {
    // 判断缓存是否准备好
    if (!this.cache) throw new Error('Cache is not ready')
    // 将资源元数据转换为字符串
    const keyString = resourceKeyToString({
      id: ResMeta.id,
      variant: variant
    })
    // 返回缓存对象
    return this.cache.match(keyString)
  }

  // 获取资源元数据
  getResourceMeta(ResMeta: StaticResourceMetaRecord, variant?: string) {
    // 判断缓存是否准备好
    if (!this.cache) throw new Error('Cache is not ready')
    // 将资源元数据转换为字符串
    const keyString = resourceKeyToString({
      id: ResMeta.id,
      variant: variant
    })
    // 判断缓存中是否存在指定key
    if (this.meta.exist(keyString)) {
      // 返回缓存元数据
      return this.meta.get(keyString)
    } else {
      // 返回undefined
      return undefined
    }
  }

  // 设置资源元数据
  async setResourceMeta(
    ResMeta: StaticResourceMetaRecord,
    variant: string | undefined,
    resp: Response
  ) {
    // 判断缓存是否准备好
    if (!this.cache) throw new Error('Cache is not ready')
    // 将资源元数据转换为字符串
    const keyString = resourceKeyToString({
      id: ResMeta.id,
      variant: variant
    })
    const _resp = resp.clone()
    if (_resp.body == null) {
      throw new Error('Response body is null')
    }
    const reader = _resp.body.getReader()
    let size = 0
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.length
    }
    // 将资源存入缓存
    console.log(keyString)
    await this.cache.put(keyString, resp)
    // 设置缓存元数据
    return this.meta.set(keyString, ResMeta, variant, size)
  }

  async removeResource(ResMeta: StaticResourceMetaRecord, variant?: string) {
    // 判断缓存是否准备好
    if (!this.cache) throw new Error('Cache is not ready')
    // 将资源元数据转换为字符串
    const keyString = resourceKeyToString({
      id: ResMeta.id,
      variant: variant
    })
    // 从缓存中删除资源
    this.meta.delete(keyString)
    await this.cache.delete(keyString)
  }

  async getAllMeta() {
    return this.meta.getAllMeta()
  }
}

// 导出缓存管理类
export default CacheManager
