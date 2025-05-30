import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { saveAs } from 'file-saver'
import type { FC } from 'react'
import * as XLSX from 'xlsx'

/**
 * 下拉导出属性
 */
type DropdownProps = {
  renderRecords: any // 渲染记录
  paraphrases: any // 释义
}
/**
 * 下拉导出
 * @param param0
 * @returns
 */
const DropdownExport: FC<DropdownProps> = ({ renderRecords, paraphrases }) => {
  /**
   * 格式化时间戳
   * @param date 日期
   * @returns 时间戳
   */
  const formatTimestamp = (date: any) => {
    /**
     * 年
     */
    const year = date.getFullYear()

    /**
     * 月份
     */
    const month = String(date.getMonth() + 1).padStart(2, '0') // 月份从0开始
    /**
     * 日
     */
    const day = String(date.getDate()).padStart(2, '0')
    /**
     * 小时
     */
    const hours = String(date.getHours()).padStart(2, '0')
    /**
     * 分钟
     */
    const minutes = String(date.getMinutes()).padStart(2, '0')
    /**
     * 秒
     */
    const seconds = String(date.getSeconds()).padStart(2, '0')

    /**
     * 返回时间戳
     */
    return `${year}-${month}-${day} ${hours}-${minutes}-${seconds}`
  }

  /**
   * 导出
   * @param bookType 文件类型
   */
  const handleExport = (bookType: string) => {
    const ExportData: Array<{ 单词: string; 释义: string; 错误次数: number; 词典: string }> = []

    /**
     * 渲染记录
     */
    renderRecords.forEach((item: any) => {
      const word = paraphrases.find((w: any) => w.name === item.word)
      ExportData.push({
        单词: item.word,
        释义: word ? word.trans.join('；') : '',
        错误次数: item.wrongCount,
        词典: item.dict,
      })
    })

    let blob: Blob

    /**
     * 如果文件类型为 txt
     */
    if (bookType === 'txt') {
      /**
       * 导出 txt 文件
       */
      const content = ExportData.map((item: any) => `${item.单词}: ${item.释义}`).join('\n')
      blob = new Blob([content], { type: 'text/plain' })
    } else {
      /**
       * 单词 sheet
       */
      const worksheet = XLSX.utils.json_to_sheet(ExportData)
      /**
       * 工作簿
       */
      const workbook = XLSX.utils.book_new()
      /**
       * 添加工作表
       */
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
      /**
       * 导出 excel 文件
       */
      const excelBuffer = XLSX.write(workbook, { bookType: bookType as XLSX.BookType, type: 'array' })
      blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
    }

    /**
     * 时间戳
     */
    const timestamp = formatTimestamp(new Date())
    /**
     * 文件名
     */
    const fileName = `ErrorBook_${timestamp}.${bookType}`
    /**
     * 如果 blob 和文件名存在，则导出文件
     */
    if (blob && fileName) {
      saveAs(blob, fileName)
    }
  }

  /**
   * 返回下拉导出
   * @returns 下拉导出
   */
  return (
    <div className="z-10">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="my-btn-primary h-8 shadow transition hover:bg-indigo-600">导出</button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="mt-1 rounded bg-indigo-500 text-white shadow-lg">
          <DropdownMenu.Item
            className="cursor-pointer rounded px-4 py-2 hover:bg-indigo-400 focus:bg-indigo-600 focus:outline-none"
            onClick={() => handleExport('xlsx')}
          >
            .xlsx
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="cursor-pointer rounded px-4 py-2 hover:bg-indigo-600 focus:bg-indigo-600 focus:outline-none"
            onClick={() => handleExport('csv')}
          >
            .csv
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  )
}

export default DropdownExport
