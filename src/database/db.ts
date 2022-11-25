// db.ts
import Dexie, { Table } from 'dexie'

export interface Deck {
  id?: number
  name: string
}

export interface Word {
  id?: number
  word: string
  deckId: number
}

export class VocabDB extends Dexie {
  decks!: Table<Deck>
  words!: Table<Word>

  constructor () {
    super('vocabulary')
    this.version(1).stores({
      decks: '++id, name',
      words: '++id, word, deckId'
    })
  }
}

export const db = new VocabDB()
