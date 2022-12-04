import { Accessor } from 'solid-js'
import { defaultNextIntervalDays } from '../consts/schedule'
import { db, Deck } from './db'
import { query } from './query'

export const queryDeckWithWords = (
  deckId: number
): Accessor<{ deck: Deck; wordCount: number } | undefined> => {
  return query(async () => {
    const [deck, wordCount] = await Promise.all([
      db.decks.get(deckId),
      db.words.where('deckId').equals(deckId).count()
    ])

    if (deck == null) {
      return undefined
    }

    return {
      deck,
      wordCount
    }
  })
}

export const addDraftWord = async (
  word: string,
  deckId: number
): Promise<number> => {
  const result = await db.words.add({
    word,
    meaning: '',
    context: '',
    dueDate: new Date(),
    isDraft: 1,
    deckId,
    nextIntervalDays: defaultNextIntervalDays
  })

  return result as number
}
