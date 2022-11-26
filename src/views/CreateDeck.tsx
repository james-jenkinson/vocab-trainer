import { useNavigate } from '@solidjs/router'
import { JSX } from 'solid-js'
import { db } from '../database/db'

const CreateDeck = (): JSX.Element => {
  let name!: HTMLInputElement
  const navigate = useNavigate()

  const onSubmit = (e: Event): void => {
    e.preventDefault()
    db.decks
      .add({ name: name.value })
      .then(() => navigate('/'))
      .catch(console.error)
  }

  return (
    <main>
      <h1>Create Deck</h1>
      <form onSubmit={onSubmit}>
        <label for="input-create-deck-name">Name</label>
        <input class="input" ref={name} id="input-create-deck-name" />
        <button class="button">Create</button>
      </form>
    </main>
  )
}

export default CreateDeck
