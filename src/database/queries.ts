import { Accessor } from 'solid-js'
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
