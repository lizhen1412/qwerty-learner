import type { TypingState } from '@/pages/Typing/store/type'
import {
  currentChapterAtom,
  currentDictInfoAtom,
  isOpenDarkModeAtom,
  keySoundsConfigAtom,
  phoneticConfigAtom,
  pronunciationConfigAtom,
  randomConfigAtom,
} from '@/store'
import type { InfoPanelType } from '@/typings'
import type { PronunciationType } from '@/typings'
import { useAtomValue } from 'jotai'
import mixpanel from 'mixpanel-browser'
import { useCallback } from 'react'

/**
 * 用户对应用点赞/取消点赞的操作类型
 * - 'star': 点赞
 * - 'dismiss': 取消点赞
 */
export type starAction = 'star' | 'dismiss'

/**
 * 记录用户点赞/取消点赞行为到Mixpanel
 * @param action 用户操作类型，可以是'star'或'dismiss'
 */
export function recordStarAction(action: starAction) {
  const props = {
    action,
  }
  mixpanel.track('star', props)
}

/**
 * 打开信息面板的位置类型
 * - 'footer': 底部栏
 * - 'resultScreen': 结果页面
 */
export type openInfoPanelLocation = 'footer' | 'resultScreen'

/**
 * 记录用户打开信息面板的行为
 * @param type 信息面板类型
 * @param location 打开面板的位置
 */
export function recordOpenInfoPanelAction(type: InfoPanelType, location: openInfoPanelLocation) {
  const props = {
    type,
    location,
  }
  mixpanel.track('openInfoPanel', props)
}

/**
 * 分享操作类型
 * - 'open': 打开分享面板
 * - 'download': 下载分享内容
 */
export type shareType = 'open' | 'download'

/**
 * 记录用户分享行为
 * @param type 分享类型
 */
export function recordShareAction(type: shareType) {
  mixpanel.track('share', { type })
}

/**
 * 分析页面操作类型（目前仅支持打开）
 */
export type analysisType = 'open'

/**
 * 记录用户打开分析页面的行为
 * @param type 操作类型
 */
export function recordAnalysisAction(type: analysisType) {
  const props = {
    type,
  }

  mixpanel.track('analysis', props)
}

/**
 * 错题本操作类型
 * - 'open': 打开错题本
 * - 'detail': 查看错题详情
 */
export type errorBookType = 'open' | 'detail'

/**
 * 记录用户使用错题本的行为
 * @param type 操作类型
 */
export function recordErrorBookAction(type: errorBookType) {
  const props = {
    type,
  }

  mixpanel.track('error-book', props)
}

/**
 * 捐赠卡片信息类型
 */
export type donateCardInfo = {
  type: 'donate' | 'dismiss' // 操作类型：捐赠或关闭
  chapterNumber: number // 章节编号
  wordNumber: number // 单词数量
  sumWrongCount: number // 总错误次数
  dayFromFirstWord: number // 从第一个单词到当前天数
  dayFromQwerty: number // 从Qwerty键盘到当前天数
  amount: number // 捐赠金额
}

/**
 * 记录捐赠卡片相关行为
 * @param info 捐赠卡片信息对象
 */
export function reportDonateCard(info: donateCardInfo) {
  const props = {
    ...info,
  }

  mixpanel.track('donate-card', props)
}

/**
 * mixpanel 单词和章节统计事件
 * 用户学习模式配置信息
 */
export type ModeInfo = {
  modeDictation: boolean // 是否开启听写模式
  modeDark: boolean // 是否开启暗黑模式
  modeShuffle: boolean // 是否开启随机模式

  enabledKeyboardSound: boolean // 是否开启键盘音效
  enabledPhotonicsSymbol: boolean // 是否显示音标
  enabledSingleWordLoop: boolean // 是否开启单词循环模式

  pronunciationAuto: boolean // 是否开启发音自动模式
  pronunciationOption: PronunciationType | 'none' // 发音类型或'none'(不发音)
}

/**
 * 单词学习日志上传数据结构
 */
export type WordLogUpload = ModeInfo & {
  headword: string // 当前学习的单词
  timeStart: string // 开始学习时间
  timeEnd: string // 结束学习时间
  countInput: number // 输入次数
  countCorrect: number // 正确次数
  countTypo: number // 错误次数
  order: number // 单词序号
  chapter: string // 章节编号
  wordlist: string // 词库名称
}

/**
 * 章节学习日志上传数据结构
 */
export type ChapterLogUpload = ModeInfo & {
  chapter: string // 章节编号
  wordlist: string // 词库名称
  timeEnd: string // 章节学习结束时间
  duration: number // 学习时长(秒)
  countInput: number // 总输入次数
  countCorrect: number // 正确输入次数
  countTypo: number // 错误输入次数
}

/**
 * 创建单词学习日志上传函数
 * @param typingState 当前打字状态
 * @returns 返回一个用于上传单词学习日志的回调函数
 */
export function useMixPanelWordLogUploader(typingState: TypingState) {
  // 获取当前章节信息
  const currentChapter = useAtomValue(currentChapterAtom)
  // 获取当前词典信息
  const { name: dictName } = useAtomValue(currentDictInfoAtom)
  // 获取暗黑模式状态
  const isDarkMode = useAtomValue(isOpenDarkModeAtom)
  // 获取键盘音效配置
  const keySoundsConfig = useAtomValue(keySoundsConfigAtom)
  // 获取音标显示配置
  const phoneticConfig = useAtomValue(phoneticConfigAtom)
  // 获取发音配置
  const pronunciationConfig = useAtomValue(pronunciationConfigAtom)
  // 获取随机模式配置
  const randomConfig = useAtomValue(randomConfigAtom)

  /**
   * 单词学习日志上传回调函数
   */
  const wordLogUploader = useCallback(
    (wordLog: { headword: string; timeStart: string; timeEnd: string; countInput: number; countCorrect: number; countTypo: number }) => {
      const props: WordLogUpload = {
        ...wordLog,
        order: typingState.chapterData.index + 1, // 单词序号(从1开始)
        chapter: (currentChapter + 1).toString(), // 章节编号(从1开始)
        wordlist: dictName, // 词库名称
        modeDictation: !typingState.isWordVisible, // 是否开启听写模式
        modeDark: isDarkMode, // 是否开启暗黑模式
        modeShuffle: randomConfig.isOpen, // 是否开启随机模式
        enabledKeyboardSound: keySoundsConfig.isOpen, // 是否开启键盘音效
        enabledPhotonicsSymbol: phoneticConfig.isOpen, // 是否显示音标
        enabledSingleWordLoop: typingState.isLoopSingleWord, // 是否开启单词循环模式
        pronunciationAuto: pronunciationConfig.isOpen, // 是否开启发音自动模式
        pronunciationOption: pronunciationConfig.isOpen === false ? 'none' : pronunciationConfig.type, // 发音类型或'none'(不发音)
      }
      mixpanel.track('Word', props)
    },
    [
      typingState,
      currentChapter,
      dictName,
      isDarkMode,
      keySoundsConfig.isOpen,
      phoneticConfig.isOpen,
      pronunciationConfig.isOpen,
      pronunciationConfig.type,
      randomConfig.isOpen,
    ],
  )

  return wordLogUploader
}

/**
 * 创建章节学习日志上传函数
 * @param typingState 当前打字状态
 * @returns 返回一个用于上传章节学习日志的回调函数
 */
export function useMixPanelChapterLogUploader(typingState: TypingState) {
  // 获取当前章节信息
  const currentChapter = useAtomValue(currentChapterAtom)
  // 获取当前词典信息
  const { name: dictName } = useAtomValue(currentDictInfoAtom)
  // 获取暗黑模式状态
  const isDarkMode = useAtomValue(isOpenDarkModeAtom)
  // 获取键盘音效配置
  const keySoundsConfig = useAtomValue(keySoundsConfigAtom)
  // 获取音标显示配置
  const phoneticConfig = useAtomValue(phoneticConfigAtom)
  // 获取发音配置
  const pronunciationConfig = useAtomValue(pronunciationConfigAtom)
  // 获取随机模式配置
  const randomConfig = useAtomValue(randomConfigAtom)

  /**
   * 章节学习日志上传回调函数
   */
  const chapterLogUploader = useCallback(() => {
    // 构造上传数据对象
    const props: ChapterLogUpload = {
      timeEnd: getUtcStringForMixpanel(), // 获取当前UTC时间
      duration: typingState.timerData.time, // 学习时长
      countInput: typingState.chapterData.correctCount + typingState.chapterData.wrongCount, // 总输入次数
      countTypo: typingState.chapterData.wrongCount, // 错误输入次数
      countCorrect: typingState.chapterData.correctCount, // 正确输入次数
      chapter: (currentChapter + 1).toString(), // 章节编号(从1开始)
      wordlist: dictName, // 词库名称
      modeDictation: !typingState.isWordVisible, // 是否听写模式
      modeDark: isDarkMode, // 是否暗黑模式
      modeShuffle: randomConfig.isOpen, // 是否随机模式
      enabledKeyboardSound: keySoundsConfig.isOpen, // 是否开启键盘音效
      enabledPhotonicsSymbol: phoneticConfig.isOpen, // 是否显示音标
      enabledSingleWordLoop: typingState.isLoopSingleWord, // 是否单词循环
      pronunciationAuto: pronunciationConfig.isOpen, // 是否自动发音
      pronunciationOption: pronunciationConfig.isOpen === false ? 'none' : pronunciationConfig.type, // 发音类型
    }

    // 上传章节学习数据
    mixpanel.track('Chapter', props)
  }, [
    typingState,
    currentChapter,
    dictName,
    isDarkMode,
    keySoundsConfig.isOpen,
    phoneticConfig.isOpen,
    pronunciationConfig.isOpen,
    pronunciationConfig.type,
    randomConfig.isOpen,
  ])
  return chapterLogUploader
}

/**
 * 记录数据导入/导出行为
 * @param param0 包含以下属性的对象:
 *   - type: 操作类型('export'或'import')
 *   - size: 数据大小
 *   - wordCount: 单词数量
 *   - chapterCount: 章节数量
 */
export function recordDataAction({
  type, // 操作类型
  size, // 数据大小
  wordCount, // 单词数量
  chapterCount, // 章节数量
}: {
  type: 'export' | 'import' // 操作类型
  size: number // 数据大小
  wordCount: number // 单词数量
  chapterCount: number // 章节数量
}) {
  const props = {
    type,
    size,
    wordCount,
    chapterCount,
  }

  // 上传数据操作记录
  mixpanel.track('dataAction', props)
}

/**
 * 获取当前UTC时间字符串(格式: YYYY-MM-DD HH:MM:SS)
 * @returns 格式化后的UTC时间字符串
 */
export function getUtcStringForMixpanel() {
  // 获取当前日期和时间
  const now = new Date()
  // 将日期和时间转换为ISO格式字符串
  const isoString = now.toISOString()
  // 截取ISO格式字符串的前19个字符(YYYY-MM-DD HH:MM:SS)
  const utcString = isoString.substring(0, 19).replace('T', ' ')
  // 返回格式化后的UTC时间字符串
  return utcString
}
