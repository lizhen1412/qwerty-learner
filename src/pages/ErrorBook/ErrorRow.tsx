import { LoadingWordUI } from './LoadingWordUI'
import useGetWord from './hooks/useGetWord'
import { currentRowDetailAtom } from './store'
import type { groupedWordRecords } from './type'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { idDictionaryMap } from '@/resources/dictionary'
import { recordErrorBookAction } from '@/utils'
import { useSetAtom } from 'jotai'
import type { FC } from 'react'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import DeleteIcon from '~icons/weui/delete-filled'

/**
 * 错误行属性
 */
type IErrorRowProps = {
  record: groupedWordRecords
  onDelete: () => void
  onWordUpdate: (word: any) => void
}

/**
 * 错误行
 * @param param0
 * @returns
 */
const ErrorRow: FC<IErrorRowProps> = ({ record, onDelete, onWordUpdate }) => {
  /**
   * 设置当前行详情
   */
  const setCurrentRowDetail = useSetAtom(currentRowDetailAtom)

  /**
   * 获取词典信息
   */
  const dictInfo = idDictionaryMap[record.dict]
  const { word, isLoading, hasError } = useGetWord(record.word, dictInfo)

  /**
   * 前一个单词引用
   */
  const prevWordRef = useRef<any>()

  /**
   * 稳定单词
   */
  const stableWord = useMemo(() => word, [word])

  /**
   * 点击
   */
  const onClick = useCallback(() => {
    setCurrentRowDetail(record)
    recordErrorBookAction('detail')
  }, [record, setCurrentRowDetail])

  /**
   * 使用 useEffect 监听稳定单词
   */
  useEffect(() => {
    if (stableWord && stableWord !== prevWordRef.current) {
      onWordUpdate(stableWord)
      prevWordRef.current = stableWord
    }
  }, [stableWord, onWordUpdate])

  /**
   * 返回错误行
   * @returns 错误行
   */
  return (
    <li
      className="opacity-85 flex w-full cursor-pointer items-center justify-between rounded-lg bg-white px-6 py-3 text-black shadow-md dark:bg-gray-800 dark:text-white"
      onClick={onClick}
    >
      <span className="basis-2/12 break-normal">{record.word}</span>
      <span className="basis-6/12 break-normal">
        {word ? word.trans.join('；') : <LoadingWordUI isLoading={isLoading} hasError={hasError} />}
      </span>
      <span className="basis-1/12 break-normal pl-8">{record.wrongCount}</span>
      <span className="basis-1/12 break-normal">{dictInfo?.name}</span>
      <span
        className="basis-1/12 break-normal"
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DeleteIcon />
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete Records</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </span>
    </li>
  )
}

export default ErrorRow
