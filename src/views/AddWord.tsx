import { A, useParams } from '@solidjs/router'
import { createSignal, JSX, Show } from 'solid-js'
import { addMinutes } from 'date-fns'
import { db } from '../database/db'
import { defaultDueMinutes, defaultNextIntervalDays } from '../consts/schedule'
import './AddWord.css'

const AddWord = (): JSX.Element => {
  let word!: HTMLInputElement
  const { id: deckId } = useParams()
  const [addedWords, setAddedWords] = createSignal<string[]>([])

  const onSubmit = (event: Event): void => {
    event.preventDefault()

    db.words
      .add({
        word: word.value,
        dueDate: addMinutes(new Date(), defaultDueMinutes),
        deckId: parseInt(deckId, 10),
        nextIntervalDays: defaultNextIntervalDays
      })
      .then(() => {
        setAddedWords([word.value, ...addedWords()])
        word.value = ''
      })
      .catch(console.error)
  }

  return (
    <main>
      <A class="button narrow" href={`/deck/${deckId}`}>
        Back to Deck
      </A>

      <div class="added-words">
        <Show when={addedWords().length > 0}>
          Just added: {addedWords().join(', ')}
        </Show>
      </div>

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
