import type { Word } from '@/typings'

/**
 * 单词列表数据获取器
 * @param {string} url - 请求的URL路径
 * @returns {Promise<Word[]>} 返回解析后的单词列表Promise
 *
 * 功能说明:
 * 1. 根据部署环境自动添加URL前缀
 * 2. 使用fetch API获取数据
 * 3. 返回解析后的JSON数据
 *
 * 环境变量说明:
 * REACT_APP_DEPLOY_ENV - 部署环境标识
 *   - 'pages': 表示部署在GitHub Pages等静态托管环境
 *   - 其他值: 使用基础路径
 *
 * 使用示例:
 * wordListFetcher('/data/cet4.json')
 *   .then(words => console.log(words))
 *   .catch(error => console.error(error));
 */
export async function wordListFetcher(url: string): Promise<Word[]> {
  // 根据部署环境自动添加URL前缀
  const URL_PREFIX: string = REACT_APP_DEPLOY_ENV === 'pages' ? '/qwerty-learner' : ''

  // 使用fetch API获取数据
  const response = await fetch(URL_PREFIX + url)

  // 验证数据格式
  const words: Word[] = await response.json()
  return words
}
