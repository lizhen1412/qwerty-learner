import classNames from 'classnames'
import type { ElementType, SVGAttributes } from 'react'
import IconExclamationTriangle from '~icons/heroicons/exclamation-triangle-solid'
import IconHandThumbUp from '~icons/heroicons/hand-thumb-up-solid'
import IconHeart from '~icons/heroicons/heart-solid'

/**
 * 图标映射
 */
type IconMapper = {
  icon: ElementType<SVGAttributes<SVGSVGElement>>
  className: string
  text: (mistakeCount: number) => string
}

/**
 * 图标映射
 */
const ICON_MAPPER: IconMapper[] = [
  {
    icon: IconHeart, // 心形图标
    className: 'text-indigo-600', // 心形图标颜色
    text: (mistakeCount: number) => `表现不错！` + (mistakeCount > 0 ? `只错了 ${mistakeCount} 个单词` : '全对了！'), // 心形图标文本
  },
  {
    icon: IconHandThumbUp, // 点赞图标
    className: 'text-indigo-600', // 点赞图标颜色
    text: () => '有些小问题哦，下一次可以做得更好！', // 点赞图标文本
  },
  {
    icon: IconExclamationTriangle, // 感叹号图标
    className: 'text-indigo-600', // 感叹号图标颜色
    text: () => '错误太多，再来一次如何？', // 感叹号图标文本
  },
]

/**
 * 结论栏
 * 用于显示打字结果的总结和建议
 * @param param0 结论栏的属性
 * @returns 结论栏
 */
const ConclusionBar = ({ mistakeLevel, mistakeCount }: ConclusionBarProps) => {
  const { icon: Icon, className, text } = ICON_MAPPER[mistakeLevel]

  return (
    <div className="flex h-10 flex-row items-center">
      <Icon className={classNames(className, 'h-5 w-5')} />
      <span className="ml-2 inline-block align-middle text-sm font-medium leading-10 text-gray-700 sm:text-sm md:text-base">
        {text(mistakeCount)}
      </span>
    </div>
  )
}

/**
 * 结论栏的属性
 */
export type ConclusionBarProps = {
  /** 错误级别 */
  mistakeLevel: number
  /** 错误数量 */
  mistakeCount: number
}

export default ConclusionBar
