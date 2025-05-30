import type { groupedWordRecords } from '../type'
import { atom } from 'jotai'

/**
 * 当前行详情
 */
export const currentRowDetailAtom = atom<groupedWordRecords | null>(null)
