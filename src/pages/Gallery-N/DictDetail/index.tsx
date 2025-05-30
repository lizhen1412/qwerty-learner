import { useDeleteWordRecord } from '../../../utils/db'
import Chapter from '../Chapter'
import { ErrorTable } from '../ErrorTable'
import { getRowsFromErrorWordData } from '../ErrorTable/columns'
import { ReviewDetail } from '../ReviewDetail'
import useErrorWordData from '../hooks/useErrorWords'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { currentChapterAtom, currentDictIdAtom, reviewModeInfoAtom } from '@/store'
import type { Dictionary } from '@/typings'
import range from '@/utils/range'
import { useAtom, useSetAtom } from 'jotai'
import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import IcOutlineCollectionsBookmark from '~icons/ic/outline-collections-bookmark'
import MajesticonsPaperFoldTextLine from '~icons/majesticons/paper-fold-text-line'
import PajamasReviewList from '~icons/pajamas/review-list'

/**
 * 标签
 */
enum Tab {
  Chapters = 'chapters', // 章节
  Errors = 'errors', // 错误
  Review = 'review', // 回顾
}

/**
 * 词典详情
 * @param param0 词典
 * @returns 词典详情
 */
export default function DictDetail({ dictionary: dict }: { dictionary: Dictionary }) {
  /**
   * 当前章节
   */
  const [currentChapter, setCurrentChapter] = useAtom(currentChapterAtom)
  const [currentDictId, setCurrentDictId] = useAtom(currentDictIdAtom)
  const [curTab, setCurTab] = useState<Tab>(Tab.Chapters)
  /**
   * 设置回顾模式信息
   */
  const setReviewModeInfo = useSetAtom(reviewModeInfoAtom)
  /**
   * 导航
   */
  const navigate = useNavigate()
  /**
   * 删除单词记录
   */
  const { deleteWordRecord } = useDeleteWordRecord()
  /**
   * 重新加载
   */
  const [reload, setReload] = useState(false)

  /**
   * 当前章节
   */
  const chapter = useMemo(() => (dict.id === currentDictId ? currentChapter : 0), [currentChapter, currentDictId, dict.id])
  /**
   * 错误单词数据
   */
  const { errorWordData, isLoading, error } = useErrorWordData(dict, reload)
  /**
   * 表格数据
   */
  const tableData = useMemo(() => {
    return getRowsFromErrorWordData(errorWordData)
  }, [errorWordData])

  /**
   * 处理删除单词
   */
  const onDelete = useCallback(
    /**
     * 处理删除单词
     * @param word 单词
     */
    async (word: string) => {
      /**
       * 删除单词记录
       */
      await deleteWordRecord(word, dict.id)
      /**
       * 重新加载
       */
      setReload((old) => !old)
    },
    [deleteWordRecord, dict.id],
  )

  /**
   * 处理章节改变
   * @param index 章节
   */
  const onChangeChapter = useCallback(
    /**
     * 设置当前章节
     * @param index 章节
     */
    (index: number) => {
      /**
       * 设置当前词典 ID
       */
      setCurrentDictId(dict.id)
      /**
       * 设置当前章节
       */
      setCurrentChapter(index)
      /**
       * 设置回顾模式信息
       */
      setReviewModeInfo((old) => ({ ...old, isReviewMode: false }))
      /**
       * 导航到首页
       */
      navigate('/')
    },
    [dict.id, navigate, setCurrentChapter, setCurrentDictId, setReviewModeInfo],
  )

  /**
   * 处理标签改变
   * @param value 标签
   */
  const handleTabChange = useCallback(
    /**
     * 处理标签改变
     * @param value 标签
     */
    (value: Tab) => {
      /**
       * 如果标签改变，则设置当前标签
       */
      if (value !== curTab) {
        /**
         * 设置当前标签
         */
        setCurTab(value)
      }
    },
    [curTab],
  )

  /**
   * 返回词典详情
   * @returns 词典详情
   */
  return (
    <div className="flex flex-col rounded-[4rem] px-4 py-3 pl-5 text-gray-800 dark:text-gray-300">
      <div className="text relative flex h-40 flex-col gap-2">
        <h3 className="text-2xl font-semibold">{dict.name}</h3>
        <p className="mt-1">{dict.chapterCount} 章节</p>
        <p>共 {dict.length} 词</p>
        <p>{dict.description}</p>
        <div className="absolute bottom-5 right-4">
          <ToggleGroup type="single" value={curTab} onValueChange={handleTabChange}>
            <ToggleGroupItem
              value={Tab.Chapters}
              disabled={curTab === Tab.Chapters}
              className={`${curTab === Tab.Chapters ? 'text-primary-foreground bg-primary' : ''} disabled:opacity-100`}
            >
              <MajesticonsPaperFoldTextLine className="mr-1.5 text-gray-500" />
              章节选择
            </ToggleGroupItem>
            {errorWordData.length > 0 && (
              <>
                <ToggleGroupItem
                  value={Tab.Errors}
                  disabled={curTab === Tab.Errors}
                  className={`${curTab === Tab.Errors ? 'text-primary-foreground bg-primary' : ''} disabled:opacity-100`}
                >
                  <IcOutlineCollectionsBookmark className="mr-1.5 text-gray-500" />
                  查看错题
                </ToggleGroupItem>
                <ToggleGroupItem
                  value={Tab.Review}
                  disabled={curTab === Tab.Review}
                  className={`${curTab === Tab.Review ? 'text-primary-foreground bg-primary' : ''} disabled:opacity-100`}
                >
                  <PajamasReviewList className="mr-1.5 text-gray-500" />
                  错题回顾
                </ToggleGroupItem>
              </>
            )}
          </ToggleGroup>
        </div>
      </div>
      <div className="flex pl-0">
        <Tabs value={curTab} className="h-[30rem] w-full ">
          <TabsContent value={Tab.Chapters} className="h-full ">
            <ScrollArea className="h-[30rem] ">
              <div className="flex w-full flex-wrap gap-3">
                {range(0, dict.chapterCount, 1).map((index) => (
                  <Chapter
                    key={`${dict.id}-${index}`}
                    index={index}
                    checked={chapter === index}
                    dictID={dict.id}
                    onChange={onChangeChapter}
                  />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value={Tab.Errors} className="h-full">
            <ErrorTable data={tableData} isLoading={isLoading} error={error} onDelete={onDelete} />
          </TabsContent>
          <TabsContent value={Tab.Review} className="h-full">
            <ReviewDetail errorData={errorWordData} dict={dict} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
