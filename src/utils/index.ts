import { CHAPTER_LENGTH } from '@/constants'
import type { Howl } from 'howler'

// 导出mixpanel相关工具函数
export * from './mixpanel'

/**
 * 禁止的按键列表
 * 包含各种功能键、方向键、系统键等不应触发打字事件的按键
 */
const bannedKeys = [
  'Enter', // 回车键
  'Backspace', // 退格键
  'Delete', // 删除键
  'Tab', // 制表符
  'CapsLock', // 大写锁定键
  'Shift', // 左shift键
  'Control', // 左ctrl键
  'Alt', // 左alt键
  'Meta', // Meta键(Command/Win)
  'Escape', // ESC键
  'Fn', // 功能键
  'FnLock', // 功能锁定
  'Hyper', // 超键
  'Super', // Super键
  'OS', // 操作系统键
  // Up, down, left and right keys
  'ArrowUp', // 上箭头
  'ArrowDown', // 下箭头
  'ArrowLeft', // 左箭头
  'ArrowRight', // 右箭头
  // volume keys
  'AudioVolumeUp', // 音量上键
  'AudioVolumeDown', // 音量下键
  'AudioVolumeMute', // 静音键
  // special keys
  'End', // 结束键
  'PageDown', // 下翻页键
  'PageUp', // 上翻页键
  'Clear', // 清除键
  'Home', // 主页键
]

/**
 * 检查按键是否合法(是否在允许输入的按键范围内)
 * @param key 按键名称
 * @returns 是否合法
 */
export const isLegal = (key: string): boolean => {
  if (bannedKeys.includes(key)) return false
  return true
}

/**
 * 检查字符是否是中文标点符号
 * @param val 要检查的字符
 * @returns 是否是中文标点
 */
export const isChineseSymbol = (val: string): boolean =>
  /[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/.test(
    val,
  )

/**
 * 判断当前设备是否是桌面端
 * @returns 是否是桌面设备
 */
export const IsDesktop = () => {
  const userAgentInfo = navigator.userAgent
  const Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod']

  let flag = true
  for (let v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false
      break
    }
  }
  return flag
}

// 判断是否是Mac OS系统
export const IS_MAC_OS = navigator.userAgent.indexOf('Macintosh') !== -1

// 根据系统返回Ctrl键的显示名称(Mac显示"Control"，其他显示"Ctrl")
export const CTRL = IS_MAC_OS ? 'Control' : 'Ctrl'

/**
 * 添加Howl音频监听器(返回取消监听的函数)
 * @param howl Howl实例
 * @param args Howl.on的参数
 * @returns 取消监听的函数
 */
export function addHowlListener(howl: Howl, ...args: Parameters<Howl['on']>) {
  howl.on(...args)

  return () => howl.off(...args)
}

/**
 * 合并多个className(处理null/undefined/空字符串)
 * @param classNames 要合并的类名数组
 * @returns 合并后的类名字符串
 */
export function classNames(...classNames: Array<string | void | null>) {
  const finallyClassNames: string[] = []

  for (const className of classNames) {
    if (className) {
      finallyClassNames.push(className.trim())
    }
  }

  return finallyClassNames.join(' ')
}

/**
 * 获取当前日期字符串(格式:YYYYMMDD)
 * @returns 日期字符串
 */
export function getCurrentDate() {
  const date = new Date()
  const year = date.getFullYear()
  const month = ('0' + (date.getMonth() + 1)).slice(-2)
  const day = ('0' + date.getDate()).slice(-2)

  return `${year}${month}${day}`
}

/**
 * 计算章节数量(根据总单词数和每章长度)
 * @param length 总单词数
 * @returns 章节数
 */
export function calcChapterCount(length: number) {
  return Math.ceil(length / CHAPTER_LENGTH)
}

/**
 * 找出两个数组的交集
 * @param xs 第一个数组
 * @param ys 第二个数组
 * @returns 共同元素数组
 */
export function findCommonValues<T>(xs: T[], ys: T[]): T[] {
  const set = new Set(ys)
  return xs.filter((x) => set.has(x))
}

/**
 * 数字保留指定位数小数
 * @param number 要处理的数字
 * @param fractionDigits 小数位数
 * @returns 处理后的数字
 */
export function toFixedNumber(number: number, fractionDigits: number) {
  return Number((number ?? 0).toFixed(fractionDigits))
}

/**
 * 获取当前UTC时间戳(秒级)
 * @returns UTC时间戳(秒)
 */
export function getUTCUnixTimestamp() {
  const now = new Date()
  return Math.floor(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(),
      now.getUTCMinutes(),
      now.getUTCSeconds(),
      now.getUTCMilliseconds(),
    ) / 1000,
  )
}

/**
 * 将时间戳转换为本地日期时间字符串(中文格式)
 * @param timestamp Unix时间戳(秒)
 * @returns 格式化的日期时间字符串(如 "05月20日 14:30")
 */
export function timeStamp2String(timestamp: number) {
  const date = new Date(timestamp * 1000)

  const dateString = date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })
  const timeString = date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false })

  return `${dateString} ${timeString}`
}
