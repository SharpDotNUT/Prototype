import type { Ref } from 'vue'

export interface t_word {
  zhCN: string
  en: string
  ja: string
  tags: string[]
}

/**
 * 过滤单词列表 (Filter word list)
 * @param word 当前单词对象 (Current word object)
 * @param searchString 搜索关键词 (Search keyword)
 * @param searchTags 需要匹配的标签 (Tags to match)
 * @param searchFrom 搜索的语言字段 (Language field to search from)
 * @returns 是否匹配过滤条件 (Whether it matches the filter conditions)
 */
export function filter(
  word: t_word,
  searchString: Ref<string>,
  searchTags: Ref<string[]>,
  searchFrom: Ref<string>
): boolean {
  // 1. 文本匹配检查 (Text matching check)
  const isTextMatch = checkTextMatch(word, searchString.value, searchFrom.value)
  // 2. 标签匹配检查 (Tag matching check)
  const areTagsMatch = checkTagsMatch(word.tags, searchTags.value)
  // 必须同时满足文本和标签条件 (Must satisfy both text and tag conditions)
  return isTextMatch && areTagsMatch
}

/**
 * 检查文本是否匹配搜索条件 (Check if text matches search criteria)
 */
function checkTextMatch(
  word: t_word,
  searchTerm: string,
  searchField: string
): boolean {
  // 如果没有搜索词，则认为匹配 (If no search term, consider it a match)
  if (!searchTerm) return true
  const term = searchTerm.toLowerCase()
  // 根据指定字段搜索 (Search based on specified field)
  switch (searchField) {
    case 'zh-Hans':
      return word.zhCN?.toLowerCase().includes(term) ?? false
    case 'en':
      return word.en?.toLowerCase().includes(term) ?? false
    case 'ja':
      return word.ja?.toLowerCase().includes(term) ?? false
    default:
      // 默认搜索所有语言字段 (Default: search all language fields)
      return (
        (word.zhCN?.toLowerCase().includes(term) ||
          word.en?.toLowerCase().includes(term) ||
          word.ja?.toLowerCase().includes(term)) ??
        false
      )
  }
}

/**
 * 检查标签是否匹配 (Check if tags match)
 */
function checkTagsMatch(wordTags: string[], searchTags: string[]): boolean {
  // 如果没有指定搜索标签，则认为匹配 (If no search tags specified, consider it a match)
  if (searchTags.length === 0) return true
  // 如果单词没有标签，则不匹配 (If word has no tags, no match)
  if (!wordTags) return false
  // 检查所有搜索标签是否都存在于单词标签中 (Check if all search tags exist in word tags)
  return searchTags.every((tag) => wordTags.includes(tag))
}
