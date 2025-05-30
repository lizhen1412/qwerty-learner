import type { TErrorWordData } from '../hooks/useErrorWords'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import type { ColumnDef } from '@tanstack/react-table'
import PhArrowsDownUpFill from '~icons/ph/arrows-down-up-fill'
import DeleteIcon from '~icons/weui/delete-filled'

/**
 * 错误列
 */
export type ErrorColumn = {
  word: string // 单词
  trans: string // 释义
  errorCount: number // 错误次数
  errorChar: string[] // 易错字母
}

/**
 * 错误列
 * @param onDelete 删除单词
 * @returns 错误列
 */
export const errorColumns = (onDelete: (word: string) => Promise<void>): ColumnDef<ErrorColumn>[] => [
  {
    accessorKey: 'word', // 单词
    size: 100, // 大小
    header: ({ column }) => {
      return (
        <Button variant="ghost" className="p-0" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          单词
          <PhArrowsDownUpFill className="ml-1.5 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'trans', // 释义
    size: 500, // 大小
    header: '释义',
  },
  {
    accessorKey: 'errorCount', // 错误次数
    size: 40, // 大小
    header: ({ column }) => {
      return (
        <Button variant="ghost" className="p-0" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          错误次数
          <PhArrowsDownUpFill className="ml-1.5 h-4 w-4" />
        </Button>
      )
    },
    /**
     * 返回单元格
     * @param row 行
     * @returns 单元格
     */
    cell: ({ row }) => {
      return <span className="flex justify-center">{row.original.errorCount} </span>
    },
  },
  {
    accessorKey: 'errorChar', // 易错字母
    header: '易错字母', // 标题
    size: 100, // 大小
    /**
     * 返回单元格
     * @param row 行
     * @returns 单元格
     */
    cell: ({ row }) => {
      return (
        <p>
          {(row.getValue('errorChar') as string[]).map((char, index) => (
            <kbd className="flex justify-center" key={`${char}-${index}`}>
              {char + ' '}
            </kbd>
          ))}
        </p>
      )
    },
  },
  {
    accessorKey: 'delete', // 删除
    header: '', // 标题
    size: 40, // 大小
    /**
     * 返回单元格
     * @param row 行
     * @returns 单元格
     */
    cell: ({ row }) => {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <DeleteIcon className="cursor-pointer" onClick={() => onDelete(row.original.word)} />
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete Records</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
  },
]

/**
 * 从错误单词数据中获取行
 * @param data 错误单词数据
 * @returns 行
 */
export function getRowsFromErrorWordData(data: TErrorWordData[]): ErrorColumn[] {
  /**
   * 返回行
   */
  return data.map((item) => {
    /**
     * 返回行
     */
    return {
      word: item.word, // 单词
      trans: item.originData.trans.join('，') ?? '', // 释义
      errorCount: item.errorCount, // 错误次数
      errorChar: item.errorChar, // 易错字母
    }
  })
}
