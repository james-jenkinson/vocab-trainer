import { A, useParams } from '@solidjs/router'
import { createSignal, JSX, Show } from 'solid-js'
import { addMinutes } from 'date-fns'
import { db } from '../database/db'
import { defaultDueMinutes, defaultNextIntervalDays } from '../consts/schedule'
import './AddWord.css'

const AddWord = (): JSX.Element => {
  const { id: deckId } = useParams()
  const [addedWords, setAddedWords] = createSignal<string[]>([])

  let word!: HTMLInputElement
  let meaning!: HTMLInputElement
  let context!: HTMLInputElement

  const onSubmit = (event: Event): void => {
    event.preventDefault()

    db.words
      .add({
        word: word.value,
        meaning: meaning.value,
        context: context.value,
        dueDate: addMinutes(new Date(), defaultDueMinutes),
        deckId: parseInt(deckId, 10),
        nextIntervalDays: defaultNextIntervalDays
      })
      .then(() => {
        setAddedWords((words) => [word.value, ...words])
        word.value = ''
        meaning.value = ''
        context.value = ''
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

        <label for="input-word-meaning">Meaning</label>
        <input ref={meaning} class="input" id="input-word-meaning" />

        <label for="input-word-context">Context</label>
        <input ref={context} class="input" id="input-word-context" />

        <button class="button">Add</button>
      </form>
    </main>
  )
}

export default AddWord
