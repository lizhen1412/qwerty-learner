import atomForConfig from './atomForConfig'
import { reviewInfoAtom } from './reviewInfoAtom'
import { DISMISS_START_CARD_DATE_KEY, defaultFontSizeConfig } from '@/constants'
import { idDictionaryMap } from '@/resources/dictionary'
import { correctSoundResources, keySoundResources, wrongSoundResources } from '@/resources/soundResource'
import type {
  Dictionary,
  InfoPanelState,
  LoopWordTimesOption,
  PhoneticType,
  PronunciationType,
  WordDictationOpenBy,
  WordDictationType,
} from '@/typings'
import type { ReviewRecord } from '@/utils/db/record'
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

/**
 * 当前词典ID原子
 * 存储当前选择的词典ID，默认值为'cet4'
 * 使用localStorage持久化存储
 */
export const currentDictIdAtom = atomWithStorage('currentDict', 'cet4')

/**
 * 当前词典信息原子
 * 根据currentDictIdAtom的值获取对应的词典信息
 * 如果ID无效则返回cet4词典
 */
export const currentDictInfoAtom = atom<Dictionary>((get) => {
  const id = get(currentDictIdAtom)
  let dict = idDictionaryMap[id]
  // 如果 dict 不存在，则返回 cet4. Typing 中会检查 DictId 是否存在，如果不存在则会重置为 cet4
  if (!dict) {
    dict = idDictionaryMap.cet4
  }
  return dict
})

/**
 * 当前章节原子
 * 存储当前学习的章节索引，默认值为0
 * 使用localStorage持久化存储
 */
export const currentChapterAtom = atomWithStorage('currentChapter', 0)

/**
 * 单词循环配置原子
 * 配置单词循环练习的次数
 * 使用atomForConfig创建，支持类型安全和自动修复
 */
export const loopWordConfigAtom = atomForConfig<{ times: LoopWordTimesOption }>('loopWordConfig', {
  times: 1, // 默认循环1次
})

/**
 * 按键音效配置原子
 * 配置键盘按键音效相关参数
 */
export const keySoundsConfigAtom = atomForConfig('keySoundsConfig', {
  isOpen: true, // 是否开启按键音效
  isOpenClickSound: true, // 是否开启点击音效
  volume: 1, // 音量
  resource: keySoundResources[0], // 音效资源
})

/**
 * 提示音效配置原子
 * 配置正确/错误提示音效相关参数
 */
export const hintSoundsConfigAtom = atomForConfig('hintSoundsConfig', {
  isOpen: true, // 是否开启提示音效
  volume: 1, // 音量
  isOpenWrongSound: true, // 是否开启错误提示音效
  isOpenCorrectSound: true, // 是否开启正确提示音效
  wrongResource: wrongSoundResources[0], // 错误提示音效资源
  correctResource: correctSoundResources[0], // 正确提示音效资源
})

/**
 * 发音配置原子
 * 配置单词发音相关参数
 */
export const pronunciationConfigAtom = atomForConfig('pronunciation', {
  isOpen: true, // 是否开启发音
  volume: 1, // 音量
  type: 'us' as PronunciationType, // 发音类型
  name: '美音', // 发音名称
  isLoop: false, // 是否循环发音
  isTransRead: false, // 是否开启翻译发音
  transVolume: 1, // 翻译发音音量
  rate: 1, // 发音速度
})

/**
 * 字体大小配置原子
 * 配置界面字体大小
 */
export const fontSizeConfigAtom = atomForConfig('fontsize', defaultFontSizeConfig)

/**
 * 发音是否开启原子
 * 根据pronunciationConfigAtom的值判断发音是否开启
 */
export const pronunciationIsOpenAtom = atom((get) => get(pronunciationConfigAtom).isOpen)

/**
 * 翻译发音是否开启原子
 * 根据pronunciationConfigAtom的值判断翻译发音是否开启
 */
export const pronunciationIsTransReadAtom = atom((get) => get(pronunciationConfigAtom).isTransRead)

/**
 * 随机配置原子
 * 配置随机练习相关参数
 */
export const randomConfigAtom = atomForConfig('randomConfig', {
  isOpen: false,
})

/**
 * 是否显示前一个/后一个单词原子
 * 配置是否显示前一个/后一个单词
 */
export const isShowPrevAndNextWordAtom = atomWithStorage('isShowPrevAndNextWord', true)

/**
 * 是否忽略大小写原子
 * 配置是否忽略大小写
 */
export const isIgnoreCaseAtom = atomWithStorage('isIgnoreCase', true)

/**
 * 是否显示悬停答案原子
 * 配置是否显示悬停答案
 */
export const isShowAnswerOnHoverAtom = atomWithStorage('isShowAnswerOnHover', true)

/**
 * 是否可选择文本原子
 * 配置是否可选择文本
 */
export const isTextSelectableAtom = atomWithStorage('isTextSelectable', false)

/**
 * 复习模式信息原子
 * 配置复习模式相关参数
 */
export const reviewModeInfoAtom = reviewInfoAtom({
  isReviewMode: false, // 是否是复习模式
  reviewRecord: undefined as ReviewRecord | undefined, // 复习记录
})

/**
 * 是否是复习模式原子
 * 根据reviewModeInfoAtom的值判断是否是复习模式
 */
export const isReviewModeAtom = atom((get) => get(reviewModeInfoAtom).isReviewMode)

/**
 * 音标配置原子
 * 配置音标相关参数
 */
export const phoneticConfigAtom = atomForConfig('phoneticConfig', {
  isOpen: true,
  type: 'us' as PhoneticType,
})

/**
 * 是否开启暗色模式原子
 * 根据系统主题判断是否开启暗色模式
 */
export const isOpenDarkModeAtom = atomWithStorage('isOpenDarkModeAtom', window.matchMedia('(prefers-color-scheme: dark)').matches)

/**
 * 是否显示跳过按钮原子
 */
export const isShowSkipAtom = atom(false)

/**
 * 是否在开发模式原子
 * 配置是否在开发模式
 */
export const isInDevModeAtom = atom(false)

/**
 * 信息面板状态原子
 * 配置信息面板相关参数
 */
export const infoPanelStateAtom = atom<InfoPanelState>({
  donate: false, // 是否显示捐赠按钮
  vsc: false, // 是否显示VSCode插件按钮
  community: false, // 是否显示社区按钮
  redBook: false, // 是否显示红宝书按钮
})

/**
 * 单词发音配置原子
 * 配置单词发音相关参数
 */
export const wordDictationConfigAtom = atomForConfig('wordDictationConfig', {
  isOpen: false, // 是否开启单词发音
  type: 'hideAll' as WordDictationType, // 发音类型
  openBy: 'auto' as WordDictationOpenBy, // 发音打开方式
})

export const dismissStartCardDateAtom = atomWithStorage<Date | null>(DISMISS_START_CARD_DATE_KEY, null)

// for dev test
//   dismissStartCardDateAtom = atom<Date | null>(new Date())
