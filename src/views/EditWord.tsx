import { A, useNavigate, useParams, useSearchParams } from '@solidjs/router'
import { JSX, Show } from 'solid-js'
import WordForm, { FormData } from '../components/WordForm'
import { db } from '../database/db'
import { addDraftWord } from '../database/queries'
import { query } from '../database/query'
import './EditWord.css'

const EditWord = (): JSX.Element => {
  const { id } = useParams()
  const [{ returnTo }] = useSearchParams()
  const wordId = parseInt(id, 10)
  const navigate = useNavigate()

  const returnHref = returnTo == null ? '/' : returnTo

  const word = query(async () => await db.words.get(wordId))

  const connections = query(async () => {
    const connections = await db.wordConnections.where({ wordId }).toArray()

    return (
      await db.words
        .where('id')
        .anyOf(connections.map((connection) => connection.connectionWordId))
        .toArray()
    ).map((word) => ({
      word: word.word,
      wordId: word.id as number,
      isExisting: true
    }))
  })

  const onSubmit = (data: FormData): void => {
    db.transaction('rw', db.words, db.wordConnections, async () => {
      const newIds = await Promise.all(
        data.connections
          .filter((connection) => !connection.isExisting)
          .map(async (connection) => {
            return await addDraftWord(connection.word, word()?.deckId as number)
          })
      )
      const existingIds = data.connections
        .filter((c) => c.isExisting)
        .map((c) => c.wordId)

      const allIds = new Set([...newIds, ...existingIds])
      const removedIds = connections()
        ?.filter((connection) => !allIds.has(connection.wordId))
        .map((c) => c.wordId)

      const previousIds = new Set(connections()?.map((c) => c.wordId))
      const idsToAdd = [...newIds, ...existingIds].filter(
        (id) => !previousIds.has(id)
      )

      const removeOldConnections = Promise.all(
        removedIds?.map(async (id) => {
          await db.wordConnections
            .where({ wordId, connectionWordId: id })
            .delete()
        }) ?? []
      )

      const addNewConnections = Promise.all(
        idsToAdd.map(
          async (id) =>
            await db.wordConnections.add({
              wordId,
              connectionWordId: id
            })
        )
      )

      await Promise.all([removeOldConnections, addNewConnections])

      await db.words.update(wordId, data)
    })
      .then(() => navigate(returnHref))
      .catch(console.error)
  }

  const defaultData = (): Partial<FormData> => {
    const data = word()

    const result = {
      word: data?.word,
      meaning: data?.meaning,
      context: data?.context,
      connections: connections()
    }

    return result
  }

  return (
    <main>
      <div class="header">
        <h1>Edit</h1>
        <A class="button" href={returnHref}>
          Back
        </A>
      </div>
      <Show when={word()}>
        <WordForm
          onSubmit={onSubmit}
          deckId={word()?.deckId as number}
          submitText="Update"
          defaultData={defaultData()}
        />
      </Show>
    </main>
  )
}

export default EditWord
