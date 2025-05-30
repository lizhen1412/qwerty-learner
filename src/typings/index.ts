export * from './resource'

/**
 * 发音类型定义
 * 支持多种语言的发音类型：
 * - us: 美式英语发音
 * - uk: 英式英语发音
 * - romaji: 日语罗马音
 * - zh: 中文拼音
 * - ja: 日语假名
 * - de: 德语发音
 * - hapin: 哈萨克语拉丁转写
 * - kk: 哈萨克语西里尔转写
 * - id: 印尼语发音
 */
export type PronunciationType = 'us' | 'uk' | 'romaji' | 'zh' | 'ja' | 'de' | 'hapin' | 'kk' | 'id'

/**
 * 音标类型定义
 * 与PronunciationType保持相同的选项，表示不同语言的音标系统
 */
export type PhoneticType = 'us' | 'uk' | 'romaji' | 'zh' | 'ja' | 'de' | 'hapin' | 'kk' | 'id'

/**
 * 语言类型定义
 * 扩展支持更多语言和特殊类型：
 * - en: 英语
 * - romaji: 日语罗马字
 * - zh: 中文
 * - ja: 日语
 * - code: 编程代码
 * - de: 德语
 * - kk: 哈萨克语
 * - hapin: 哈拼(哈萨克语拉丁转写)
 * - id: 印尼语
 */
export type LanguageType = 'en' | 'romaji' | 'zh' | 'ja' | 'code' | 'de' | 'kk' | 'hapin' | 'id'

/**
 * 语言分类类型
 * 主要语言分类，用于UI分组等场景
 */
export type LanguageCategoryType = 'en' | 'ja' | 'de' | 'code' | 'kk' | 'id'

/**
 * 发音类型到音标类型的映射
 * 定义每种发音类型对应的音标系统
 */
type Pronunciation2PhoneticMap = Record<PronunciationType, PhoneticType>

/**
 * 发音-音标映射关系常量
 * 保持发音类型和音标类型的一一对应
 */
export const PRONUNCIATION_PHONETIC_MAP: Pronunciation2PhoneticMap = {
  us: 'us',
  uk: 'uk',
  romaji: 'romaji',
  zh: 'zh',
  ja: 'ja',
  de: 'de',
  hapin: 'hapin',
  kk: 'kk',
  id: 'id',
}

/**
 * 单词基础类型
 * 定义单词数据结构：
 * - name: 单词拼写
 * - trans: 翻译数组(支持多释义)
 * - usphone: 美式音标
 * - ukphone: 英式音标
 * - notation?: 可选字段，特殊注音/标记
 */
export type Word = {
  name: string // 单词文本
  trans: string[] // 翻译数组(多释义)
  usphone: string // 美式音标
  ukphone: string // 英式音标
  notation?: string // 可选字段，特殊注音/标记
}

/**
 * 带索引的单词类型
 * 扩展基础Word类型，增加在章节中的原始位置索引
 */
export type WordWithIndex = Word & {
  // 在 chapter 中的原始索引
  index: number
}

/**
 * 信息面板类型
 * 定义应用中各种信息面板的标识：
 * - donate: 捐赠面板
 * - vsc: VSCode插件面板
 * - community: 社区面板
 * - redBook: 小红书面板
 */
export type InfoPanelType = 'donate' | 'vsc' | 'community' | 'redBook'

/**
 * 信息面板状态类型
 * 记录各信息面板的显示状态
 * 使用映射类型定义，每个面板对应一个布尔值
 */
export type InfoPanelState = {
  [key in InfoPanelType]: boolean
}

/**
 * 单词循环次数选项
 * 定义单词重复练习的可选次数：
 * - 1: 练习1次
 * - 3: 练习3次
 * - 5: 练习5次
 * - 8: 练习8次
 * - Number.MAX_SAFE_INTEGER: 无限循环(实际表示最大安全整数)
 */
export type LoopWordTimesOption = 1 | 3 | 5 | 8 | typeof Number.MAX_SAFE_INTEGER

/**
 * 单词默写模式类型
 * 定义不同的单词默写方式：
 * - hideAll: 隐藏全部字母
 * - hideVowel: 只隐藏元音字母
 * - hideConsonant: 只隐藏辅音字母
 * - randomHide: 随机隐藏部分字母
 */
export type WordDictationType = 'hideAll' | 'hideVowel' | 'hideConsonant' | 'randomHide'

/**
 * 标记用户是手动打开默写模式，还是通过点击 resultScreen 中的默写本章按钮打开的
 *
 * 预期行为是，在进入下一章节时，如果是手动打开的默写模式，则保持设定
 * 如果是通过点击 resultScreen 中的默写本章按钮打开的，则关闭默写模式
 */
export type WordDictationOpenBy = 'user' | 'auto'
