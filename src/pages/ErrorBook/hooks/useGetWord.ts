import type { Dictionary, Word } from '@/typings'
import { wordListFetcher } from '@/utils/wordListFetcher'
import { useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'

/**
 * 获取单词
 * @param name 单词名称
 * @param dict 词典
 * @returns 单词
 */
export default function useGetWord(name: string, dict: Dictionary) {
  /**
   * 使用 SWR 获取单词列表
   */
  const { data: wordList, error, isLoading } = useSWR(dict?.url, wordListFetcher)

  /**
   * 是否存在错误
   */
  const [hasError, setHasError] = useState(false)

  /**
   * 单词
   */
  const word: Word | undefined = useMemo(() => {
    if (!wordList) return undefined

    /**
     * 获取单词
     */
    const word = wordList.find((word) => word.name === name)

    /**
     * 如果单词存在，则返回单词
     */
    if (word) {
      return word
    } else {
    /**
     * 如果单词不存在，则设置错误
     */
      setHasError(true)
      return undefined
    }
  }, [wordList, name])

  /**
   * 使用 useEffect 监听错误
   */
  useEffect(() => {
    /**
     * 如果错误，则设置错误
     */
    if (error) setHasError(true)
  }, [error])

  /**
   * 返回单词
   * @returns 单词
   */
  return { word, isLoading, hasError }
}
