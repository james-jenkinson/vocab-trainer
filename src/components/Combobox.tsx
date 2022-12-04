import { JSX, For, createSignal, onCleanup } from 'solid-js'
import { uniqueId } from '../utils/unique'
import './Combobox.css'

export interface EnterPayload<T> {
  label: string
  fromSuggestionList: boolean
  id?: T
}

interface Props<T> {
  id?: string
  suggestions: Array<{ label: string; id: T }>
  listLabel: string
  onInput?: (event: Event) => void
  onEnter?: (event: Event & EnterPayload<T>) => void
}

const id = uniqueId('combobox')

const Combobox = <T,>(props: Props<T>): JSX.Element => {
  let container!: HTMLElement
  let input!: HTMLInputElement
  let suggestionList!: HTMLUListElement
  const [highlightedSuggestion, setHighlightedSuggestion] = createSignal<{
    index: number
    id: T
  }>()
  const [showList, setShowList] = createSignal(false)

  const comboboxId = id()

  const onPointerUp = (event: Event): void => {
    if (container.contains(event.target as HTMLElement)) {
      return
    }

    setShowList(false)
  }

  document.addEventListener('pointerup', onPointerUp)

  onCleanup(() => {
    document.removeEventListener('pointerup', onPointerUp)
  })

  const onInput = (event: Event): void =>
    props.onInput != null ? props.onInput(event) : undefined

  const navigateItems = (direction: -1 | 1): void => {
    const suggestion = highlightedSuggestion()
    const listHighlighted = suggestion != null

    const items = suggestionList.querySelectorAll('li')
    if (items.length === 0) return

    const shouldRollover =
      listHighlighted &&
      ((direction === 1 && suggestion.index >= items.length - 1) ||
        (direction === -1 && suggestion.index === 0))

    const nextIndex =
      shouldRollover || !listHighlighted
        ? direction === 1
          ? 0
          : items.length - 1
        : suggestion.index + direction

    items[nextIndex].classList.add('highlight')
    items[suggestion?.index as number]?.classList?.remove('highlight')
    const nextSuggestion = props.suggestions[nextIndex]
    setHighlightedSuggestion({ index: nextIndex, id: nextSuggestion.id })
  }

  const onInputKeyDown = (event: KeyboardEvent): void => {
    switch (event.key) {
      case 'Enter': {
        if (props.onEnter == null) {
          return
        }
        const suggestion = highlightedSuggestion()
        const fromSuggestionList = suggestion != null
        let chosenItem = fromSuggestionList
          ? props.suggestions[suggestion.index]
          : undefined

        const label = chosenItem != null ? chosenItem.label : input.value

        if (chosenItem == null) {
          chosenItem = props.suggestions.find(
            (suggestion) => suggestion.label === label
          )
        }

        props.onEnter(
          Object.assign(event, {
            label,
            fromSuggestionList: chosenItem != null,
            id: chosenItem?.id
          })
        )
        input.value = ''
        setShowList(false)
        break
      }

      case 'ArrowUp':
      case 'ArrowDown': {
        if (props.suggestions.length === 0) return

        event.preventDefault()
        setShowList(true)
        if (!event.altKey) {
          navigateItems(event.key === 'ArrowUp' ? -1 : 1)
        }
        return
      }

      case 'Escape':
      case 'Tab': {
        setShowList(false)
        break
      }
    }

    setHighlightedSuggestion()
  }

  const onFocus = (): void => {
    setShowList(true)
  }

  const listId = `${comboboxId}-suggestion-list`

  const suggestionId = (id: T): string =>
    `${comboboxId}-suggestion-id-${JSON.stringify(id)}`

  const selectItem = (id: T, event: Event): void => {
    if (props.onEnter == null) return

    const item = props.suggestions.find((item) => item.id === id)
    if (item == null) return

    props.onEnter(
      Object.assign(event, {
        label: item.label,
        fromSuggestionList: true,
        id
      })
    )
    input.value = ''
    setShowList(false)
  }

  return (
    <span ref={container} class="combobox-container">
      <input
        ref={input}
        id={props.id}
        class="input"
        onInput={onInput}
        onKeyDown={onInputKeyDown}
        onFocus={onFocus}
        aria-expanded={showList() && props.suggestions.length > 0}
        aria-activedescendent={
          highlightedSuggestion() != null
            ? suggestionId(highlightedSuggestion()?.id as T)
            : undefined
        }
        aria-controls={listId}
      />
      <ul
        id={listId}
        class="combobox-list"
        classList={{ display: showList() }}
        ref={suggestionList}
        role="listbox"
        aria-label={props.listLabel}
      >
        <For each={props.suggestions}>
          {(suggestion) => (
            <li
              class="combobox-list-item"
              onClick={(e) => selectItem(suggestion.id, e)}
              id={suggestionId(suggestion.id)}
              role="option"
              aria-selected={highlightedSuggestion()?.id === suggestion.id}
            >
              {suggestion.label}
            </li>
          )}
        </For>
      </ul>
    </span>
  )
}

export default Combobox
