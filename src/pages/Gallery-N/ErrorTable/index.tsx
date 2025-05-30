import type { ErrorColumn } from './columns'
import { errorColumns } from './columns'
import { LoadingUI } from '@/components/Loading'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { SortingState } from '@tanstack/react-table'
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { useMemo, useState } from 'react'

/**
 * 数据表属性
 */
interface DataTableProps {
  data: ErrorColumn[] // 数据
  isLoading: boolean // 是否加载
  error: unknown // 错误
  onDelete: (word: string) => Promise<void> // 删除单词
}

/**
 * 错误表格
 * @param param0 数据表属性
 * @returns 错误表格
 */
export function ErrorTable({ data, isLoading, error, onDelete }: DataTableProps) {
  /**
   * 排序
   */
  const [sorting, setSorting] = useState<SortingState>([])
  /**
   * 列
   */
  const columns = useMemo(() => errorColumns(onDelete), [onDelete])
  /**
   * 表格
   */
  const table = useReactTable({
    data, // 数据
    columns, // 列
    getCoreRowModel: getCoreRowModel(), // 核心行模型
    onSortingChange: setSorting, // 排序改变
    getSortedRowModel: getSortedRowModel(), // 获取排序行模型
    state: {
      sorting, // 排序
    },
    autoResetPageIndex: true, // 自动重置页索引
  })

  /**
   * 返回错误表格
   * @returns 错误表格
   */
  return (
    <div className="h-full w-full rounded-md border p-1">
      <Table className="h-full w-full" {...{}}>
        <TableHeader className="sticky top-0 bg-white dark:bg-slate-900">
          {
            /**
             * 获取表头组
             */
            table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {
                  /**
                   * 获取表头
                   */
                  headerGroup.headers.map((header) => {
                    /**
                     * 返回表头
                     */
                    return (
                      <TableHead
                        key={header.id}
                        {...{
                          colSpan: header.colSpan,
                          style: {
                            width: header.getSize(),
                          },
                        }}
                      >
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    )
                  })
                }
              </TableRow>
            ))
          }
        </TableHeader>
        <TableBody className="w-full">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <TableCell
                      key={cell.id}
                      {...{
                        style: {
                          width: cell.column.getSize(),
                        },
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={table.getAllColumns().length} className="h-[22rem] text-center">
                {isLoading ? <LoadingUI /> : error ? '好像遇到错误啦！尝试刷新下' : '暂无数据, 快去练习吧！'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
