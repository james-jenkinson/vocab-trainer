import { A, useNavigate, useParams, useSearchParams } from '@solidjs/router'
import { JSX, Show } from 'solid-js'
import WordForm, { FormData } from '../components/WordForm'
import { db } from '../database/db'
import { query } from '../database/query'
import './EditWord.css'

const EditWord = (): JSX.Element => {
  const { id } = useParams()
  const [{ returnTo }] = useSearchParams()
  const wordId = parseInt(id, 10)
  const navigate = useNavigate()

  const returnHref = returnTo == null ? '/' : returnTo

  const word = query(async () => await db.words.get(wordId))

  const onSubmit = (data: FormData): void => {
    db.words
      .update(wordId, data)
      .then(() => navigate(returnHref))
      .catch(console.error)
  }

  const defaultData = (): Partial<FormData> => {
    const data = word()

    const result = {
      word: data?.word,
      meaning: data?.meaning,
      context: data?.context
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
          submitText="Update"
          defaultData={defaultData()}
        />
      </Show>
    </main>
  )
}

export default EditWord
