import Dexie, { Table } from 'dexie'

export interface Deck {
  id?: number
  name: string
}

export interface Word {
  id?: number
  word: string
  meaning: string
  context: string
  deckId: number
  isDraft: 0 | 1
  dueDate: Date
  nextIntervalDays: number
}

export interface WordConnection {
  wordId: number
  connectionWordId: number
}

export class VocabDB extends Dexie {
  decks!: Table<Deck>
  words!: Table<Word>
  wordConnections!: Table<WordConnection>

  constructor() {
    super('vocabulary')
    this.version(1).stores({
      decks: '++id, name',
      words: '++id, word, deckId, [deckId+isDraft]',
      wordConnections: '++id, wordId, connectionWordId'
    })
  }
}

export const db = new VocabDB()
