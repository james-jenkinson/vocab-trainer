import { useParams } from '@solidjs/router'
import { isBefore, addDays } from 'date-fns'
import { createSignal, JSX, Show } from 'solid-js'
import { db, Word } from '../database/db'
import { query } from '../database/query'
import './StudyDeck.css'

const StudyDeck = (): JSX.Element => {
  const { id } = useParams()
  const deckId = parseInt(id, 10)

  const deck = query(async () => await db.decks.get(deckId))

  type WordRecord = Record<number, { word: Word; reviewed: boolean }>

  const [wordsToRevise, setWordsToRevise] = createSignal<WordRecord>()
  const [currentWord, setCurrentWord] = createSignal<Word>()

  db.words
    .where('deckId')
    .equals(deckId)
    .and((word) => isBefore(word.dueDate, new Date()))
    .toArray()
    .then((words) => {
      const groupedWords = words.reduce<WordRecord>((prev, next) => {
        prev[next.id as number] = {
          word: next,
          reviewed: false
        }
        return prev
      }, {})
      setWordsToRevise(groupedWords)
      setCurrentWord(randomWord(groupedWords))
    })
    .catch(console.error)

  const randomWord = (words: WordRecord): Word | undefined => {
    const values = Object.values(words).filter((word) => !word.reviewed)
    if (values.length === 0) {
      return undefined
    }
    const index = Math.floor(Math.random() * values.length)

    return values[index].word
  }

  const onRemembered = (): void => {
    updateWord(2)
  }

  const onForgotten = (): void => {
    updateWord(1)
  }

  const updateWord = (intervalFactor: number): void => {
    const word = currentWord() as Word
    const daysToAdd = word.nextIntervalDays

    db.words
      .update(word.id as number, {
        dueDate: addDays(new Date(), daysToAdd),
        nextIntervalDays: daysToAdd * intervalFactor
      })
      .catch(console.error)

    const newData = wordsToRevise() as WordRecord
    newData[word.id as number].reviewed = true

    setWordsToRevise(newData)

    setCurrentWord(randomWord(newData))
  }

  const hasWords = (words: WordRecord | undefined): boolean => {
    if (words == null) {
      return true
    }
    return Object.values(words).length > 0
  }

  return (
    <main>
      <h1>Study {deck()?.name}</h1>
      <Show when={currentWord()}>
        <div class="card">{currentWord()?.word}</div>
        <div class="actions">
          <button class="button failure" onClick={onForgotten}>
            Forgotton
          </button>
          <button class="button success" onClick={onRemembered}>
            Remembered
          </button>
        </div>
      </Show>
      <Show when={currentWord() == null && hasWords(wordsToRevise())}>
        <p>Finished</p>
      </Show>
      <Show when={wordsToRevise() != null && !hasWords(wordsToRevise())}>
        <p>No words to study currently</p>
      </Show>
    </main>
  )
}

export default StudyDeck
