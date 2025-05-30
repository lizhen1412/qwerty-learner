import DictTagSwitcher from './DictTagSwitcher'
import DictionaryComponent from './DictionaryWithoutCover'
import { currentDictInfoAtom } from '@/store'
import type { Dictionary } from '@/typings'
import { findCommonValues } from '@/utils'
import { useAtomValue } from 'jotai'
import { useCallback, useEffect, useMemo, useState } from 'react'

/**
 * 词典组
 * @param groupedDictsByTag 词典组
 * @returns 词典组
 */
export default function DictionaryGroup({ groupedDictsByTag }: { groupedDictsByTag: Record<string, Dictionary[]> }) {
  /**
   * 标签列表
   */
  const tagList = useMemo(() => Object.keys(groupedDictsByTag), [groupedDictsByTag])
  /**
   * 当前标签
   */
  const [currentTag, setCurrentTag] = useState(tagList.length > 0 ? tagList[0] : '')
  /**
   * 当前词典信息
   */
  const currentDictInfo = useAtomValue(currentDictInfoAtom)

  /**
   *
   * @param tag 标签
   */
  const onChangeCurrentTag = useCallback((tag: string) => {
    /**
     * 设置当前标签
     */
    setCurrentTag(tag)
  }, [])

  /**
   * 设置当前标签
   */
  useEffect(() => {
    /**
     * 获取公共标签
     */
    const commonTags = findCommonValues(tagList, currentDictInfo.tags)
    /**
     * 如果公共标签存在，则设置当前标签
     */
    if (commonTags.length > 0) {
      /**
       * 设置当前标签
       */
      setCurrentTag(commonTags[0])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDictInfo.tags, tagList])

  return (
    <div>
      <DictTagSwitcher tagList={tagList} currentTag={currentTag} onChangeCurrentTag={onChangeCurrentTag} />
      <div className="mt-8 grid gap-x-5 gap-y-10 px-1 pb-4 sm:grid-cols-1 md:grid-cols-2 dic3:grid-cols-3 dic4:grid-cols-4">
        {currentTag && groupedDictsByTag[currentTag] ? (
          groupedDictsByTag[currentTag].map((dict) => <DictionaryComponent key={dict.id} dictionary={dict} />)
        ) : (
          <div className="col-span-full text-center text-gray-500">当前分类下没有可用的词典</div>
        )}
      </div>
    </div>
  )
}
