import { db } from '.'
import { getCurrentDate, recordDataAction } from '..'

/**
 * 导出进度类型
 * 用于跟踪数据库导出进度
 */
export type ExportProgress = {
  totalRows?: number // 总行数(可选)
  completedRows: number // 已完成行数
  done: boolean // 是否完成
}

/**
 * 导入进度类型
 * 用于跟踪数据库导入进度
 */
export type ImportProgress = {
  totalRows?: number // 总行数(可选)
  completedRows: number // 已完成行数
  done: boolean // 是否完成
}

/**
 * 导出数据库
 * @param callback 进度回调函数，返回false可取消导出
 * @returns Promise<void>
 *
 * 功能流程：
 * 1. 动态加载所需库(pako压缩、文件保存、Dexie导入导出)
 * 2. 调用Dexie导出API获取原始数据
 * 3. 压缩导出的JSON数据
 * 4. 创建带日期戳的文件名并保存
 * 5. 记录导出操作统计信息
 */
export async function exportDatabase(callback: (exportProgress: ExportProgress) => boolean) {
  const [pako, { saveAs }] = await Promise.all([import('pako'), import('file-saver'), import('dexie-export-import')])

  // 执行数据库导出
  const blob = await db.export({
    progressCallback: ({ totalRows, completedRows, done }) => {
      // 转换进度格式并调用回调
      return callback({ totalRows, completedRows, done })
    },
  })

  // 获取统计信息
  const [wordCount, chapterCount] = await Promise.all([db.wordRecords.count(), db.chapterRecords.count()])

  // 处理导出的数据
  const json = await blob.text() // 获取原始JSON数据
  const compressed = pako.gzip(json) // GZIP压缩
  const compressedBlob = new Blob([compressed]) // 创建压缩后的Blob
  const currentDate = getCurrentDate() // 获取当前日期
  saveAs(compressedBlob, `Qwerty-Learner-User-Data-${currentDate}.gz`)
  // 记录导出操作统计信息
  recordDataAction({ type: 'export', size: compressedBlob.size, wordCount, chapterCount })
}

/**
 * 导入数据库
 * @param onStart 导入开始回调
 * @param callback 进度回调函数，返回false可取消导入
 * @returns Promise<void>
 *
 * 功能流程：
 * 1. 创建文件选择输入元素
 * 2. 监听文件选择事件
 * 3. 读取并解压文件内容
 * 4. 配置导入选项并执行导入
 * 5. 记录导入操作统计信息
 */
export async function importDatabase(onStart: () => void, callback: (importProgress: ImportProgress) => boolean) {
  // 加载依赖库
  const [pako] = await Promise.all([import('pako'), import('dexie-export-import')])

  // 创建隐藏的文件输入元素
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'application/gzip' // 限制为gzip文件
  input.addEventListener('change', async () => {
    const file = input.files?.[0] // 获取选中的文件
    if (!file) return // 如果没有文件，则返回

    onStart() // 调用导入开始回调

    // 读取并解压文件
    const compressed = await file.arrayBuffer()
    const json = pako.ungzip(compressed, { to: 'string' })
    const blob = new Blob([json])

    // 执行数据库导入
    await db.import(blob, {
      acceptVersionDiff: true, // 允许版本差异
      acceptMissingTables: true, // 允许缺失表
      acceptNameDiff: false, // 不允许名称差异
      acceptChangedPrimaryKey: false, // 不允许主键变化
      overwriteValues: true, // 覆盖现有值
      clearTablesBeforeImport: true, // 导入前清空表
      progressCallback: ({ totalRows, completedRows, done }) => {
        // 转换进度格式并调用回调
        return callback({ totalRows, completedRows, done })
      },
    })

    // 获取并记录统计信息
    const [wordCount, chapterCount] = await Promise.all([db.wordRecords.count(), db.chapterRecords.count()])
    recordDataAction({ type: 'import', size: file.size, wordCount, chapterCount })
  })

  input.click() // 触发文件选择对话框
}
