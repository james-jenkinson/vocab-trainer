import { createEffect, createMemo, createSignal, For, JSX } from 'solid-js'
import { db } from '../database/db'
import { query } from '../database/query'
import { uniqueNumber } from '../utils/unique'
import Combobox, { EnterPayload } from './Combobox'
import './WordForm.css'

interface Connection {
  word: string
  wordId: number
  isExisting: boolean
  typeId?: number
}

export interface FormData {
  word: string
  meaning: string
  context: string
  connections: Connection[]
}

interface Props {
  onSubmit: (data: FormData) => void
  deckId: number
  submitText: string
  defaultData?: Partial<FormData>
  resetForm?: boolean
}

const id = uniqueNumber()

let timer: number
const debounceTime = 150

const WordForm = (props: Props): JSX.Element => {
  let word!: HTMLInputElement
  let meaning!: HTMLInputElement
  let context!: HTMLInputElement
  let newConnection!: HTMLInputElement

  const [connections, setConnections] = createSignal<Connection[]>(
    props.defaultData?.connections ?? []
  )

  createEffect(() => {
    if (props.defaultData?.connections == null) return

    setConnections(props.defaultData?.connections)
  })

  const onSubmit = (event: Event): void => {
    event.preventDefault()
    props.onSubmit({
      word: word.value,
      meaning: meaning.value,
      context: context.value,
      connections: connections()
    })

    if (props.resetForm === true) {
      word.value = ''
      meaning.value = ''
      context.value = ''
      setConnections([])
    }
  }

  const words = query(async () =>
    (await db.words.where('deckId').equals(props.deckId).toArray()).map(
      (word) => ({ id: word.id as number, word: word.word })
    )
  )
  const [filter, setFilter] = createSignal<string>()

  const filteredWords = createMemo(() => {
    const filterText = filter()
    if (filterText == null) {
      return
    }
    return words()
      ?.filter((word) => {
        return word.word.toLowerCase().match(filterText.toLowerCase()) != null
      })
      .map((word) => ({ label: word.word, id: word.id }))
  })

  const defaultValue = <T,>(value: T | undefined): string => {
    if (value == null) return ''

    return value.toString()
  }

  const addConnection = (event: Event & EnterPayload<number>): void => {
    event.preventDefault()
    setConnections((connections) => [
      ...connections,
      {
        word: event.label,
        wordId: event.id ?? id(),
        isExisting: event.fromSuggestionList
      }
    ])
  }

  const addConnectionFromButton = (): void => {
    const value = newConnection?.value
    if (value === '') return

    const existingValue = words()?.find((word) => word.word === value)

    setConnections((connections) => [
      ...connections,
      {
        word: existingValue?.word ?? newConnection.value,
        wordId: existingValue?.id ?? id(),
        isExisting: existingValue != null
      }
    ])
  }

  const onChange = (event: Event): void => {
    const target = event.target as HTMLInputElement

    clearTimeout(timer)
    timer = window.setTimeout(() => {
      setFilter(target.value === '' ? undefined : target.value)
    }, debounceTime)
  }

  const removeConnection = (id: number): (() => void) => {
    return (): void => {
      setConnections((connections) =>
        connections.filter((c) => c.wordId !== id)
      )
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <label for="input-word-text">Word / Phrase</label>
      <input
        ref={word}
        class="input"
        id="input-word-text"
        value={defaultValue(props.defaultData?.word)}
      />

      <label for="input-word-meaning">Meaning</label>
      <input
        ref={meaning}
        class="input"
        id="input-word-meaning"
        value={defaultValue(props.defaultData?.meaning)}
      />

      <label for="input-word-context">Context</label>
      <input
        ref={context}
        class="input"
        id="input-word-context"
        value={defaultValue(props.defaultData?.context)}
      />

      <label for="input-word-new-connection">Add connection</label>
      <div class="input-word-new-connection-container">
        <Combobox
          id="input-word-new-connection"
          ref={newConnection}
          suggestions={filteredWords() ?? []}
          listLabel="Previous words you have saved"
          onInput={onChange}
          onEnter={addConnection}
        />
        <button class="button" type="button" onClick={addConnectionFromButton}>
          +
        </button>
      </div>

      <ul aria-live="polite">
        <For each={connections()}>
          {(connection) => (
            <li>
              <div class="connection-indicator button narrow">
                {connection.word}
                <button onClick={removeConnection(connection.wordId)}>☓</button>
              </div>
            </li>
          )}
        </For>
      </ul>

      <button class="button">{props.submitText}</button>
    </form>
  )
}

export default WordForm
