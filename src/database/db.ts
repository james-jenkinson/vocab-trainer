// db.ts
import Dexie, { Table } from 'dexie'

export interface Deck {
  id?: number
  name: string
}

export class VocabDB extends Dexie {
  decks!: Table<Deck>

  constructor () {
    super('vocabulary')
    this.version(1).stores({
      decks: '++id, name'
    })
  }
}

export const db = new VocabDB()
