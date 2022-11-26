import { A, useParams } from '@solidjs/router'
import { JSX } from 'solid-js'
import { db } from '../database/db'

const AddWord = (): JSX.Element => {
  let word!: HTMLInputElement
  const { id: deckId } = useParams()

  const onSubmit = (event: Event): void => {
    event.preventDefault()

    db.words.add({
      word: word.value,
      deckId: parseInt(deckId, 10)
    }).then(() => {
      word.value = ''
    }).catch(console.error)
  }

  return (
    <main>

      <A class="button narrow" href={`/deck/${deckId}`}>Back to Deck</A>

      <h1>Add Word</h1>
      <form onSubmit={onSubmit}>
        <label for="input-word-text">Word / Phrase</label>
        <input ref={word} class="input" id="input-word-text" />

        <button class="button">Add</button>
      </form>
    </main>
  )
}

export default AddWord
