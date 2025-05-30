import { KEY_SOUND_URL_PREFIX } from '@/resources/soundResource'
import type { SoundResource } from '@/typings'
import { Howl, Howler } from 'howler'

/**
 * 播放按键音效
 * @param soundResource 音效资源对象，包含filename属性
 *
 * 功能说明：
 * 1. 使用Howler音频库加载并播放按键音效
 * 2. 自动添加预设的URL前缀
 * 3. 固定使用WAV格式
 * 4. 设置全局音量最大(1)
 *
 * 音效资源要求：
 * - 应放置在指定目录下
 * - 使用WAV格式以获得最佳兼容性
 * - 文件名需完整包含扩展名
 *
 * 示例：
 * playKeySoundResource({
 *   key: 'click',
 *   name: 'Click Sound',
 *   filename: 'click.wav'
 * })
 */
export function playKeySoundResource(soundResource: SoundResource) {
  // 构建音效文件的完整路径
  const path = KEY_SOUND_URL_PREFIX + soundResource.filename
  // 创建Howl实例来加载和播放音效
  const sound = new Howl({
    src: path, // 设置音效文件路径
    format: ['wav'], // 设置音效格式为WAV
  })
  // 设置全局音量最大(1)
  Howler.volume(1)
  // 播放音效
  sound.play()
}
