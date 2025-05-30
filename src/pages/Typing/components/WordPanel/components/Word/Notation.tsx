import { isKanji } from '@/utils/kana'
import { useMemo } from 'react'

/**
 * 注音属性
 */
type NotationProps = {
  notation: string
}

/**
 * 注音信息
 */
type NotationInfo = {
  word: string
  phonetic?: string
}

/**
 * 注音
 */
export default function Notation({ notation }: NotationProps) {
  /**
   * 注音信息
   */
  const infos: NotationInfo[] = useMemo(() => getNotationInfo(notation), [notation])
  return (
    <div className="mx-auto flex h-20 items-end">
      <ruby className="mb-1 p-0 font-mono text-5xl text-gray-800 dark:text-opacity-80">
        {infos.map(({ word, phonetic }) => {
          const hasPhonetic = phonetic && phonetic.length > 0
          const isEmptyPhonetic = hasPhonetic && phonetic.trim().length == 0
          return (
            <>
              {word}
              {hasPhonetic && isEmptyPhonetic ? (
                <>
                  <rt>{phonetic}</rt>
                </>
              ) : (
                <>
                  <rp>{'('}</rp>
                  <rt>{phonetic}</rt>
                  <rp>{')'}</rp>
                </>
              )}
            </>
          )
        })}
      </ruby>
    </div>
  )
}

/**
 * 解析包含注音的字符串（如日语汉字+假名注音），返回结构化的信息数组
 * @param notation 输入的字符串，可能包含注音（如"漢字(かんじ)"）
 * @returns NotationInfo[] 结构化的信息数组，包含文字和对应的注音
 */
const getNotationInfo = (notation: string): NotationInfo[] => {
  // 正则表达式，用于匹配注音部分：捕获组1是文字，捕获组2是注音
  // 例如：匹配"漢字(かんじ)"，捕获组1="漢字"，捕获组2="かんじ"
  const re = /(.+?)\((.+?)\)/g
  let match // 存储正则匹配结果
  let start = 0 // 记录当前处理位置
  const ret = [] // 存储最终结果的数组

  // 循环匹配所有注音部分
  while ((match = re.exec(notation))) {
    const [fullMatch, , phonetic] = match // fullMatch是完整匹配，phonetic是注音部分
    let word = match[1] // 获取文字部分

    // 如果当前匹配位置与前一个处理位置之间有未处理的文本
    if (match.index > start) {
      // 将这部分文本加入结果数组（无注音）
      ret.push({ word: notation.substring(start, match.index), phonetic: '' })
    }

    let kanjiStart = 0 // 用于跟踪汉字开始位置
    for (let i = 0; i < word.length; i++) {
      // 遍历文字部分，处理汉字和非汉字混合的情况
      if (!isKanji(word[i])) {
        // 如果不是汉字，增加非汉字计数器
        kanjiStart += 1
      } else if (kanjiStart > 0) {
        // 如果是汉字且前面有非汉字字符
        // 将前面的非汉字部分加入结果数组（注音为空格）
        ret.push({
          word: word.substring(0, i),
          phonetic: ' ',
        })
        // 截取剩余部分继续处理
        word = word.substring(i)
        break
      }
    }

    // 将处理后的文字和对应注音加入结果数组
    ret.push({
      word,
      phonetic,
    })

    // 更新处理位置到当前匹配结束处
    start = match.index + fullMatch.length
  }

  // 处理最后未匹配的文本部分（如果有）
  if (start < notation.length) {
    ret.push({
      word: notation.substring(start),
      phonetic: '',
    })
  }
  return ret
}
