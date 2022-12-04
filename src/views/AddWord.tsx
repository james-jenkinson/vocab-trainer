import { A, useParams } from '@solidjs/router'
import { createSignal, JSX, Show } from 'solid-js'
import { addMinutes } from 'date-fns'
import { db } from '../database/db'
import { defaultDueMinutes, defaultNextIntervalDays } from '../consts/schedule'
import WordForm, { FormData } from '../components/WordForm'
import './AddWord.css'

const AddWord = (): JSX.Element => {
  const { id } = useParams()
  const deckId = parseInt(id, 10)
  const [addedWords, setAddedWords] = createSignal<string[]>([])

  const onSubmit = (data: FormData): void => {
    db.transaction('rw', db.words, db.wordConnections, async () => {
      const newIds = await Promise.all(
        data.connections
          .filter((connection) => !connection.isExisting)
          .map(
            async (connection) =>
              await db.words.add({
                word: connection.word,
                meaning: '',
                context: '',
                dueDate: new Date(),
                deckId,
                isDraft: 1,
                nextIntervalDays: defaultNextIntervalDays
              })
          )
      )
      const existingIds = data.connections
        .filter((connection) => connection.isExisting)
        .map((connection) => connection.wordId)

      const allIds = [...newIds, ...existingIds]

      const newWordId = await db.words.add({
        word: data.word,
        meaning: data.meaning,
        context: data.context,
        dueDate: addMinutes(new Date(), defaultDueMinutes),
        deckId,
        isDraft: 0,
        nextIntervalDays: defaultNextIntervalDays
      })

      await Promise.all(
        allIds.map(
          async (id) =>
            await db.wordConnections.add({
              wordId: newWordId as number,
              connectionWordId: id as number
            })
        )
      )
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
      <WordForm
        deckId={deckId}
        onSubmit={onSubmit}
        submitText="Add"
        resetForm={true}
      />
    </main>
  )
}

export default AddWord
