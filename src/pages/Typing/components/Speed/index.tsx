import { TypingContext } from '../../store'
import InfoBox from './InfoBox'
import { useContext } from 'react'

/**
 * 速度
 * 用于显示打字练习的速度
 * @returns 速度
 */
export default function Speed() {
  /**
   * 打字上下文
   */
  // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
  const { state } = useContext(TypingContext)!
  /**
   * 秒
   */
  const seconds = state.timerData.time % 60
  /**
   * 分钟
   */
  const minutes = Math.floor(state.timerData.time / 60)
  /**
   * 秒字符串
   */
  const secondsString = seconds < 10 ? '0' + seconds : seconds + ''
  /**
   * 分钟字符串
   */
  const minutesString = minutes < 10 ? '0' + minutes : minutes + ''
  /**
   * 输入数
   */
  const inputNumber = state.chapterData.correctCount + state.chapterData.wrongCount

  return (
    <div className="my-card flex w-3/5 rounded-xl bg-white p-4 py-10 opacity-50 transition-colors duration-300 dark:bg-gray-800">
      <InfoBox info={`${minutesString}:${secondsString}`} description="时间" />
      <InfoBox info={inputNumber + ''} description="输入数" />
      <InfoBox info={state.timerData.wpm + ''} description="WPM" />
      <InfoBox info={state.chapterData.correctCount + ''} description="正确数" />
      <InfoBox info={state.timerData.accuracy + ''} description="正确率" />
    </div>
  )
}
