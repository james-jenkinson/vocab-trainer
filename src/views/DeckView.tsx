import { A, useParams } from '@solidjs/router'
import { isBefore } from 'date-fns'
import { JSX } from 'solid-js'
import { db } from '../database/db'
import { query } from '../database/query'
import './DeckView.css'

const DeckView = (): JSX.Element => {
  const { id } = useParams()
  const deckId = parseInt(id, 10)

  const deck = query(async () => await db.decks.get(parseInt(id, 10)))
  const wordCount = query(
    async () => await db.words.where('deckId').equals(deckId).count()
  )

  const dueCount = query(
    async () =>
      await db.words
        .where('deckId')
        .equals(deckId)
        .and((word) => isBefore(word.dueDate, new Date()))
        .count()
  )

  return (
    <main>
      <h1>{deck()?.name}</h1>
      <h2>
        Word count: {wordCount()} | Due: {dueCount()}
      </h2>
      <div class="deck-actions">
        <A class="button" href={`/deck/${id}/add-word`}>
          Add word
        </A>
        <A class="button success" href={`/deck/${id}/study`}>
          Study
        </A>
      </div>
    </main>
  )
}

export default DeckView
