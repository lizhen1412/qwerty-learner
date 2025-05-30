import { pronunciationConfigAtom } from '@/store'
import type { PronunciationType } from '@/typings'
import { addHowlListener } from '@/utils'
import { romajiToHiragana } from '@/utils/kana'
import noop from '@/utils/noop'
import type { Howl } from 'howler'
import { useAtomValue } from 'jotai'
import { useEffect, useMemo, useState } from 'react'
import useSound from 'use-sound'
import type { HookOptions } from 'use-sound/dist/types'

/**
 * 有道发音 API
 */
const pronunciationApi = 'https://dict.youdao.com/dictvoice?audio='

/**
 * 生成单词发音源
 * @param word 单词
 * @param pronunciation 发音类型
 * @returns 发音源
 */
export function generateWordSoundSrc(word: string, pronunciation: Exclude<PronunciationType, false>): string {
  switch (pronunciation) {
    case 'uk':
      return `${pronunciationApi}${word}&type=1`
    case 'us':
      return `${pronunciationApi}${word}&type=2`
    case 'romaji':
      return `${pronunciationApi}${romajiToHiragana(word)}&le=jap`
    case 'zh':
      return `${pronunciationApi}${word}&le=zh`
    case 'ja':
      return `${pronunciationApi}${word}&le=jap`
    case 'de':
      return `${pronunciationApi}${word}&le=de`
    case 'hapin':
    case 'kk':
      return `${pronunciationApi}${word}&le=ru` // 有道不支持哈萨克语, 暂时用俄语发音兜底
    case 'id':
      return `${pronunciationApi}${word}&le=id`
    default:
      return ''
  }
}

/**
 * 使用发音声音
 * @param word 单词
 * @param isLoop 是否循环
 * @returns 发音声音
 */
export default function usePronunciationSound(word: string, isLoop?: boolean) {
  // 发音配置
  const pronunciationConfig = useAtomValue(pronunciationConfigAtom)
  // 是否循环
  const loop = useMemo(() => (typeof isLoop === 'boolean' ? isLoop : pronunciationConfig.isLoop), [isLoop, pronunciationConfig.isLoop])
  const [isPlaying, setIsPlaying] = useState(false)

  /**
   * 使用 useSound 播放发音声音
   */
  const [play, { stop, sound }] = useSound(generateWordSoundSrc(word, pronunciationConfig.type), {
    html5: true, // 使用 HTML5 音频
    format: ['mp3'], // 格式
    loop, // 是否循环
    volume: pronunciationConfig.volume, // 音量
    rate: pronunciationConfig.rate, // 速度
  } as HookOptions)

  /**
   * 使用 useEffect 监听发音声音
   */
  useEffect(() => {
    if (!sound) return // 如果声音不存在，则返回
    sound.loop(loop) // 设置循环
    return noop
  }, [loop, sound])

  /**
   * 使用 useEffect 监听发音声音
   */
  useEffect(() => {
    if (!sound) return // 如果声音不存在，则返回

    // 监听列表
    const unListens: Array<() => void> = []

    // 添加监听播放
    unListens.push(addHowlListener(sound, 'play', () => setIsPlaying(true)))
    // 添加监听结束
    unListens.push(addHowlListener(sound, 'end', () => setIsPlaying(false)))
    // 添加监听暂停
    unListens.push(addHowlListener(sound, 'pause', () => setIsPlaying(false)))
    // 添加监听错误
    unListens.push(addHowlListener(sound, 'playerror', () => setIsPlaying(false)))

    /**
     * 使用 useEffect 监听发音声音
     */
    return () => {
      setIsPlaying(false) // 设置播放状态为 false
      unListens.forEach((unListen) => unListen())
      ;(sound as Howl).unload() // 卸载声音
    }
  }, [sound])

  /**
   * 返回发音声音
   * @returns 发音声音
   */
  return { play, stop, isPlaying }
}

/**
 * 使用预加载发音声音
 * @param word 单词
 */
export function usePrefetchPronunciationSound(word: string | undefined) {
  const pronunciationConfig = useAtomValue(pronunciationConfigAtom)

  /**
   * 使用 useEffect 监听发音声音
   */
  useEffect(() => {
    if (!word) return // 如果单词不存在，则返回

    const soundUrl = generateWordSoundSrc(word, pronunciationConfig.type) // 生成发音源
    if (soundUrl === '') return // 如果发音源不存在，则返回

    const head = document.head // 获取 head 元素
    const isPrefetch = (Array.from(head.querySelectorAll('link[href]')) as HTMLLinkElement[]).some((el) => el.href === soundUrl) // 判断是否已经预加载

    if (!isPrefetch) {
      // 如果未预加载
      const audio = new Audio() // 创建音频元素
      audio.src = soundUrl // 设置音频源
      audio.preload = 'auto' // 设置预加载

      // gpt 说这这两行能尽可能规避下载插件被触发问题。 本地测试不加也可以，考虑到别的插件可能有问题，所以加上保险
      audio.crossOrigin = 'anonymous' // 设置跨域
      audio.style.display = 'none' // 设置显示

      head.appendChild(audio) // 添加音频元素

      return () => {
        head.removeChild(audio) // 移除音频元素
      }
    }
  }, [pronunciationConfig.type, word]) // 依赖发音类型和单词
}
