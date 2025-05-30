import { RadioGroup } from '@headlessui/react'
import { useState } from 'react'

/**
 * 分类导航
 */
interface Props {
  titles?: string[]
}

/**
 * 分类导航
 * @param titles 标题
 * @returns 分类导航
 */
export default function CategoryNavigation({ titles = ['中国考试', '留学考试', '代码练习'] }: Props) {
  /**
   * 当前标题
   */
  const [selectedTitle, setSelectedTitle] = useState(titles[0])

  /**
   * 渲染
   */
  return (
    <div className="mr-4 flex flex-col items-center justify-center pr-4">
      <RadioGroup value={selectedTitle} onChange={setSelectedTitle} className="flex flex-col gap-y-3">
        {titles.map((title) => (
          <RadioGroup.Option
            key={title}
            value={title}
            className={({ checked }) => `flex cursor-pointer items-center space-x-2 ${checked ? 'text-gray-800' : 'text-gray-500'}`}
          >
            {({ checked }) => (
              <>
                <div className={`mr-1 h-2.5 w-2.5 rounded-full ${checked ? 'bg-indigo-400' : 'bg-indigo-100'}`} />
                <RadioGroup.Label className="text-lg ">{title}</RadioGroup.Label>
              </>
            )}
          </RadioGroup.Option>
        ))}
      </RadioGroup>
    </div>
  )
}
