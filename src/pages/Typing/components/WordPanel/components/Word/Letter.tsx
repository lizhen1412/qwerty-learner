import { EXPLICIT_SPACE } from '@/constants'
import { fontSizeConfigAtom } from '@/store'
import { useAtomValue } from 'jotai'
import React from 'react'

/**
 * 字母状态
 */
export type LetterState = 'normal' | 'correct' | 'wrong'

/**
 * 状态类名映射
 */
const stateClassNameMap: Record<string, Record<LetterState, string>> = {
  true: {
    normal: 'text-gray-400', // 正常
    correct: 'text-green-400 dark:text-green-700', // 正确
    wrong: 'text-red-400 dark:text-red-600', // 错误
  },
  false: {
    normal: 'text-gray-600 dark:text-gray-50', // 正常
    correct: 'text-green-600 dark:text-green-400', // 正确
    wrong: 'text-red-600 dark:text-red-400', // 错误
  },
}

/**
 * 字母属性
 */
export type LetterProps = {
  letter: string // 字母
  state?: LetterState // 状态
  visible?: boolean // 可见性
}

const Letter: React.FC<LetterProps> = ({ letter, state = 'normal', visible = true }) => {
  const fontSizeConfig = useAtomValue(fontSizeConfigAtom)
  return (
    <span
      className={`m-0 p-0 font-mono font-normal ${
        stateClassNameMap[(letter === EXPLICIT_SPACE) as unknown as string][state]
      } pr-0.8 duration-0 dark:text-opacity-80`}
      style={{ fontSize: fontSizeConfig.foreignFont.toString() + 'px' }}
    >
      {visible ? letter : '_'}
    </span>
  )
}

export default React.memo(Letter)
