import { JSX } from 'solid-js'

export interface FormData {
  word: string
  meaning: string
  context: string
}

interface Props {
  onSubmit: (data: FormData) => void
  submitText: string
  defaultData?: Partial<FormData>
  resetForm?: boolean
}

const WordForm = (props: Props): JSX.Element => {
  let word!: HTMLInputElement
  let meaning!: HTMLInputElement
  let context!: HTMLInputElement

  const onSubmit = (event: Event): void => {
    event.preventDefault()
    props.onSubmit({
      word: word.value,
      meaning: meaning.value,
      context: context.value
    })

    if (props.resetForm === true) {
      word.value = ''
      meaning.value = ''
      context.value = ''
    }
  }

  const defaultValue = <T,>(value: T | undefined): string => {
    if (value == null) return ''

    return value.toString()
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

      <button class="button">{props.submitText}</button>
    </form>
  )
}

export default WordForm
