import { A, useParams } from '@solidjs/router'
import { createSignal, JSX, Show } from 'solid-js'
import { addMinutes } from 'date-fns'
import { db } from '../database/db'
import { defaultDueMinutes, defaultNextIntervalDays } from '../consts/schedule'
import WordForm, { FormData } from '../components/WordForm'
import './AddWord.css'

const AddWord = (): JSX.Element => {
  const { id: deckId } = useParams()
  const [addedWords, setAddedWords] = createSignal<string[]>([])

  const onSubmit = (data: FormData): void => {
    db.words
      .add({
        word: data.word,
        meaning: data.meaning,
        context: data.context,
        dueDate: addMinutes(new Date(), defaultDueMinutes),
        deckId: parseInt(deckId, 10),
        nextIntervalDays: defaultNextIntervalDays
      })
      .then(() => {
        setAddedWords((words) => [data.word, ...words])
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
      <WordForm onSubmit={onSubmit} submitText="Add" resetForm={true} />
    </main>
  )
}

export default AddWord
