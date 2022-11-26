import { A } from '@solidjs/router'
import { For, JSX } from 'solid-js'
import { db } from '../database/db'
import { query } from '../database/query'
import './Home.css'

const Home = (): JSX.Element => {
  const decks = query(async () => await db.decks.toArray())

  const onClick = (): void => {
    db.decks.add({ name: 'Default' }).catch(console.error)
  }

  return (
    <main>
      <h1>Home</h1>
      <ul aria-label="List of decks" class="deck-list">
        <For each={decks()}>
          {(deck) => (
            <li>
              <A
                class="deck-card"
                href={`/deck/${deck.id?.toString() as string}`}
              >
                {deck.name}
              </A>
            </li>
          )}
        </For>
      </ul>

      <button class="button create-button" onClick={() => onClick()}>
        Create default deck
      </button>
    </main>
  )
}

export default Home
