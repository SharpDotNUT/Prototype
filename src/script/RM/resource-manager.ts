import CacheManager from './cache'
import type { ResourceKey, StaticResourceMeta } from './types'
import { logger, resourceKeyToString } from './utils'

class ResourceManager {
  public StaticMetaData: StaticResourceMeta | undefined
  private CM = new CacheManager('ResourceManager')
  private MetaURL: string

  // 构造函数，传入MetaURL参数
  constructor(MetaURL: string) {
    this.MetaURL = MetaURL
    fetch(MetaURL + '/meta.json')
      .then((res) => res.json())
      .then((data) => {
        this.StaticMetaData = data
      })
  }

  // 获取资源
  async get(key: ResourceKey, force: boolean = false) {
    if (!this.StaticMetaData) throw new Error('StaticMetaData not loaded')
    const resourceMeta = this.StaticMetaData.resources[key.id]
    await this.prefetch(key, force)
    return await this.CM.getResource(resourceMeta, key.variant)
  }

  // 预取资源
  async prefetch(key: ResourceKey, force: boolean = false) {
    if (!this.StaticMetaData) throw new Error('StaticMetaData not loaded')
    const keyString = resourceKeyToString(key)
    const resourceMeta = this.StaticMetaData.resources[key.id]
    if (!resourceMeta) throw new Error(`Resource ${keyString} not found`)
    const cacheMeta = this.CM.getResourceMeta(resourceMeta, key.variant)
    let isExpired = false
    if (cacheMeta) {
      isExpired = cacheMeta.hash != resourceMeta.hash
      if (isExpired) {
        logger(`Resource ${keyString} expired, fetching...`)
      }
    } else {
      logger(`Resource ${keyString} not found in cache, fetching...`)
    }
    if (cacheMeta && !isExpired && !force) {
      logger(`Resource  ${keyString}'s cache is valid, skipping fetch`)
      return cacheMeta
    } else {
      let url: string
      if (resourceMeta.externalUrl) {
        url = resourceMeta.externalUrl
      } else {
        if (key.variant) {
          url = `${this.MetaURL}/res/${resourceMeta.id}/${key.variant}.${resourceMeta.ext}`
        } else {
          url = `${this.MetaURL}/res/${resourceMeta.id}.${resourceMeta.ext}`
        }
      }
      console.log(url)
      const res = await fetch(url)
      return await this.CM.setResourceMeta(resourceMeta, key.variant, res)
    }
  }

  async remove(key: ResourceKey) {
    if (!this.StaticMetaData) throw new Error('StaticMetaData not loaded')
    const resourceMeta = this.StaticMetaData.resources[key.id]
    if (!resourceMeta)
      throw new Error(`Resource ${key.id} | ${key.variant} not found`)
    return await this.CM.removeResource(resourceMeta, key.variant)
  }

  async getLocalMeta() {
    return await this.CM.getAllMeta()
  }
}

// 导出ResourceManager类
export default ResourceManager
