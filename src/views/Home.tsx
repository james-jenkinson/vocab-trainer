import { For, JSX } from 'solid-js'
import { db } from '../database/db'
import { query } from '../database/query'

const Home = (): JSX.Element => {
  const decks = query(async () => await db.decks.toArray())

  return (
    <main>
      <h1>Home</h1>
      <For each={decks()}>
        {(deck) => (
          <div>{deck.name}</div>
        )}
      </For>
    </main>
  )
}

export default Home
