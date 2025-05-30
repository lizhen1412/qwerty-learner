import type { FC } from 'react'
import { useCallback } from 'react'
import NextIcon from '~icons/ooui/next-ltr'
import PrevIcon from '~icons/ooui/next-rtl'

/**
 * 分页属性
 */
type IPaginationProps = {
  className?: string // 类名
  page: number // 当前页
  setPage: (page: number) => void // 设置页数
  totalPages: number // 总页数
}

/**
 * 每页条数
 */
export const ITEM_PER_PAGE = 20

/**
 * 分页
 * @param param0
 * @returns
 */
const Pagination: FC<IPaginationProps> = ({ className, page, setPage, totalPages }) => {
  /**
   * 下一页
   */
  const nextPage = useCallback(() => {
    setPage(page + 1)
  }, [page, setPage])

  /**
   * 上一页
   */
  const prevPage = useCallback(() => {
    setPage(page - 1)
  }, [page, setPage])

  /**
   * 返回分页
   * @returns 分页
   */
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        className="cursor-pointer rounded-full bg-white p-2 text-indigo-500 shadow-md dark:bg-gray-800 dark:text-indigo-300"
        onClick={prevPage}
      >
        <PrevIcon />
      </button>
      <span className="text-black dark:text-white">{`${page} / ${totalPages}`}</span>
      <button
        className="cursor-pointer rounded-full bg-white p-2 text-indigo-500 shadow-md dark:bg-gray-800 dark:text-indigo-300"
        onClick={nextPage}
      >
        <NextIcon />
      </button>
    </div>
  )
}

export default Pagination
