import { useParams } from '@solidjs/router'
import { isBefore } from 'date-fns'
import { For, JSX, Show } from 'solid-js'
import { db } from '../database/db'
import { query } from '../database/query'

const StudyDeck = (): JSX.Element => {
  const { id } = useParams()
  const deckId = parseInt(id, 10)

  const deck = query(
    async () => await db.decks.get(deckId)
  )

  const words = query(
    async () => await db.words
      .where('deckId')
      .equals(deckId)
      .and((word) => {
        console.log(word.dueDate)
        console.log(typeof word.dueDate)
        console.log('sBefore?', isBefore(word.dueDate, new Date()))
        return isBefore(word.dueDate, new Date())
      })
      .toArray()
  )

  return (
    <main>
      <h1>Study {deck()?.name}</h1>
      <Show when={words()?.length}>
        <For each={words()}>
          {(word) => (
            <div>{word.word}</div>
          )}
        </For>
      </Show>
    </main>
  )
}

export default StudyDeck
