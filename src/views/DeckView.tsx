import { useParams } from '@solidjs/router'
import { JSX } from 'solid-js'
import { db } from '../database/db'
import { query } from '../database/query'

const DeckView = (): JSX.Element => {
  const { id } = useParams()
  const deck = query(
    async () => await db.decks.get(parseInt(id, 10))
  )

  return (
    <h1>{deck()?.name}</h1>
  )
}

export default DeckView
