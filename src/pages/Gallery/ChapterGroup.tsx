import ChapterButton from './ChapterButton'
import { CHAPTER_LENGTH } from '@/constants'
import { currentChapterAtom, currentDictInfoAtom } from '@/store'
import range from '@/utils/range'
import { useAtom, useAtomValue } from 'jotai'
import type React from 'react'

/**
 * 章节组
 * @param param0
 * @returns
 */
const ChapterGroup: React.FC<ChapterGroupProps> = ({ totalWords }) => {
  const [currentChapter, setCurrentChapter] = useAtom(currentChapterAtom)
  /**
   * 词典信息
   */
  const { id: dictID, chapterCount } = useAtomValue(currentDictInfoAtom)

  /**
   * 返回章节组
   * @returns 章节组
   */
  return (
    <main className="mr-4 grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {range(0, chapterCount, 1).map((index) =>
        index + 1 === chapterCount ? (
          <ChapterButton
            wordCount={totalWords % CHAPTER_LENGTH || CHAPTER_LENGTH}
            key={`${dictID}-${index}`}
            selected={currentChapter === index}
            index={index}
            onClick={() => setCurrentChapter(index)}
          />
        ) : (
          <ChapterButton
            wordCount={CHAPTER_LENGTH}
            key={`${dictID}-${index}`}
            selected={currentChapter === index}
            index={index}
            onClick={() => setCurrentChapter(index)}
          />
        ),
      )}
    </main>
  )
}

export default ChapterGroup

/**
 * 章节组属性
 */
export type ChapterGroupProps = {
  totalWords: number // 总单词数
}
