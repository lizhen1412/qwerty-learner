import classNames from 'classnames'
import type { FC } from 'react'
import { useCallback } from 'react'
import DownIcon from '~icons/fa/sort-down'
import UPIcon from '~icons/fa/sort-up'

/**
 * 错误行属性
 */
type IHeadWrongNumberProps = {
  className?: string // 类名
  sortType: ISortType // 排序类型
  setSortType: (sortType: ISortType) => void // 设置排序类型
}

/**
 * 排序类型
 */
export type ISortType = 'asc' | 'desc' | 'none'

/**
 * 错误行
 * @param param0
 * @returns
 */
const HeadWrongNumber: FC<IHeadWrongNumberProps> = ({ className, sortType, setSortType }) => {
  /**
   * 点击
   */
  const onClick = useCallback(() => {
    const sortTypes: Record<ISortType, ISortType> = {
      asc: 'desc', // 升序
      desc: 'none', // 降序
      none: 'asc',
    }
    setSortType(sortTypes[sortType])
  }, [setSortType, sortType])

  /**
   * 返回错误行
   * @returns 错误行
   */
  return (
    <span className={`relative cursor-pointer ${className}`} onClick={onClick}>
      错误次数
      <div className="absolute -right-2 bottom-0 top-0 flex flex-col items-center justify-center text-[12px]">
        <UPIcon
          className={classNames('-mb-2 ', {
            'text-indigo-500': sortType === 'asc',
            'text-gray-400': sortType !== 'asc',
          })}
        />
        <DownIcon
          className={classNames({
            'text-indigo-500': sortType === 'desc',
            'text-gray-400': sortType !== 'desc',
          })}
        />
      </div>
    </span>
  )
}

export default HeadWrongNumber
