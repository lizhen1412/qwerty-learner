import type { LanguageCategoryType, LanguageType, PronunciationType } from '.'

/**
 * 词典资源类型 (用于原始数据定义)
 * 描述从外部加载的词典资源数据结构
 */
export type DictionaryResource = {
  id: string // 词典唯一标识符
  name: string // 词典显示名称
  description: string // 词典描述
  category: string // 分类(如"考试","基础"等)
  tags: string[] // 标签数组(用于搜索/过滤)
  url: string // 词典数据文件URL
  length: number // 词典总单词数
  language: LanguageType // 词典主要语言类型
  languageCategory: LanguageCategoryType // 语言分类(用于UI分组)
  //override default pronunciation when not undefined
  defaultPronIndex?: number // 可选，覆盖默认发音配置的索引
}

/**
 * 词典类型 (应用内部使用)
 * 扩展DictionaryResource，添加运行时计算的属性
 */
export type Dictionary = {
  id: string // 词典唯一标识符
  name: string // 词典显示名称
  description: string // 词典描述
  category: string // 分类(如"考试","基础"等)
  tags: string[] // 标签数组(用于搜索/过滤)
  url: string // 词典数据文件URL
  length: number // 词典总单词数
  language: LanguageType // 词典主要语言类型
  languageCategory: LanguageCategoryType // 语言分类(用于UI分组)
  // calculated in the store
  chapterCount: number // 章节数量
  //override default pronunciation when not undefined
  defaultPronIndex?: number // 可选，覆盖默认发音配置的索引
}

/**
 * 发音配置类型
 * 描述发音配置的结构
 */
export type PronunciationConfig = {
  name: string // 发音名称
  pron: PronunciationType // 发音类型
}

/**
 * 语言发音映射配置类型
 * 描述语言发音映射的结构
 */
export type LanguagePronunciationMapConfig = {
  defaultPronIndex: number // 默认发音索引
  pronunciation: PronunciationConfig[] // 发音配置数组
}

/**
 * 语言发音映射类型
 * 描述语言发音映射的结构
 */
export type LanguagePronunciationMap = {
  [key in LanguageType]: LanguagePronunciationMapConfig
}

/**
 * 音效资源类型
 * 描述音效资源的结构
 */
export type SoundResource = {
  key: string // 音效唯一标识符
  name: string // 音效名称
  filename: string // 音效文件名
}
