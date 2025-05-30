import { RadioGroup } from '@headlessui/react'
import { useCallback } from 'react'

/**
 * 词典标签切换器
 * @param tagList 标签列表
 * @param currentTag 当前标签
 * @param onChangeCurrentTag 切换标签
 */
type Props = {
  tagList: string[] // 标签列表
  currentTag: string // 当前标签
  onChangeCurrentTag: (tag: string) => void // 切换标签
}

/**
 * 词典标签切换器
 * @param tagList 标签列表
 * @param currentTag 当前标签
 * @param onChangeCurrentTag 切换标签
 * @returns 词典标签切换器
 */
export default function DictTagSwitcher({ tagList, currentTag, onChangeCurrentTag }: Props) {
  /**
   * 切换标签
   */
  const onChangeTag = useCallback(
    (tag: string) => {
      // 切换标签
      onChangeCurrentTag(tag)
    },
    [onChangeCurrentTag],
  )

  /**
   * 渲染
   */
  return (
    <RadioGroup value={currentTag} onChange={onChangeTag}>
      <div className="flex items-center space-x-4">
        {tagList.map((option) => (
          <RadioGroup.Option
            key={option}
            value={option}
            className={({ checked }) =>
              `cursor-pointer whitespace-nowrap rounded-[3rem] px-4 py-2 ${
                checked ? 'bg-indigo-400 text-white' : 'bg-white text-gray-600 dark:bg-gray-800 dark:text-gray-200'
              } ${!checked && 'hover:bg-indigo-100 dark:hover:bg-gray-600'}`
            }
          >
            <p className={`font-normal `}>{option}</p>
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  )
}
