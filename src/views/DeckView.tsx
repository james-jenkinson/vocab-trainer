import { A, useParams } from '@solidjs/router'
import { JSX } from 'solid-js'
import { db } from '../database/db'
import { query } from '../database/query'
import './DeckView.css'

const DeckView = (): JSX.Element => {
  const { id } = useParams()
  const deck = query(
    async () => await db.decks.get(parseInt(id, 10))
  )

  return (
    <main>
      <h1>{deck()?.name}</h1>
      <div class="deck-actions">
        <A class="button" href={`/deck/${id}/add-word`}>Add word</A>
        <A class="button" href={`/deck/${id}/study`}>Study</A>
      </div>
    </main>
  )
}

export default DeckView
