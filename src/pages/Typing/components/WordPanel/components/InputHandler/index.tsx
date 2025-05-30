import KeyEventHandler from '../KeyEventHandler'
import TextAreaHandler from '../TextAreaHandler'
import { currentDictInfoAtom } from '@/store'
import { useAtomValue } from 'jotai'
import type { FormEvent } from 'react'
import { useMemo } from 'react'

/**
 * 输入处理
 * 用于处理输入
 * @param updateInput 更新输入
 * @returns 输入处理
 */
export default function InputHandler({ updateInput }: { updateInput: (updateObj: WordUpdateAction) => void }) {
  /**
   * 当前词典信息
   */
  const dictInfo = useAtomValue(currentDictInfoAtom)

  /**
   * 处理输入
   */
  const handler = useMemo(() => {
    switch (dictInfo.language) {
      // 英文
      case 'en':
        return <KeyEventHandler updateInput={updateInput} />
      // 德语
      case 'de':
        return <KeyEventHandler updateInput={updateInput} />
      // 罗马音
      case 'romaji':
        return <KeyEventHandler updateInput={updateInput} />
      // 代码
      case 'code':
        return <TextAreaHandler updateInput={updateInput} />
      // 默认
      default:
        return <TextAreaHandler updateInput={updateInput} />
    }
  }, [dictInfo.language, updateInput])

  return <>{handler}</>
}
export type WordUpdateAction = WordAddAction | WordDeleteAction | WordCompositionAction

/**
 * 单词添加动作
 * 用于添加单词
 * @param type 类型
 * @param value 值
 * @param event 事件
 */
export type WordAddAction = {
  type: 'add' // 类型
  value: string // 值
  event: FormEvent<HTMLTextAreaElement> | KeyboardEvent // 事件
}

/**
 * 单词删除动作
 * 用于删除单词
 * @param type 类型
 * @param length 长度
 */
export type WordDeleteAction = {
  type: 'delete' // 类型
  length: number // 长度
}

/**
 * 单词组合动作
 * 用于组合单词
 * @param type 类型
 * @param value 值
 */
// composition api is not ready yet
export type WordCompositionAction = {
  type: 'composition' // 类型
  value: string // 值
}
