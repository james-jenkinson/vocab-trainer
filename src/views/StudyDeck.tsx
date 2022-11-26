import { useParams } from '@solidjs/router'
import { isBefore, addDays, addHours, isToday, startOfDay } from 'date-fns'
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
  const [answered, setAnswered] = createSignal<{
    userSaidTheyRememberedCorrectly: boolean
  }>()

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
    setAnswered({ userSaidTheyRememberedCorrectly: true })
  }

  const onForgotten = (): void => {
    setAnswered({ userSaidTheyRememberedCorrectly: false })
  }

  const confirmRemembered = (): void => {
    updateWord(2)
  }

  const confirmForgot = (): void => {
    updateWord(1)
  }

  const updateWord = (intervalFactor: number): void => {
    const word = currentWord() as Word
    const daysToAdd = word.nextIntervalDays
    const today = new Date()

    let newDate
    newDate =
      daysToAdd < 1
        ? addHours(today, daysToAdd * 24)
        : addDays(today, daysToAdd)

    if (!isToday(newDate)) {
      newDate = startOfDay(newDate)
    }

    db.words
      .update(word.id as number, {
        dueDate: newDate,
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
        <Show when={answered() == null}>
          <div class="actions">
            <button class="button failure" onClick={onForgotten}>
              Forgotton
            </button>
            <button class="button success" onClick={onRemembered}>
              Remembered
            </button>
          </div>
        </Show>
        <Show when={answered() != null}>
          <p>{currentWord()?.meaning}</p>

          <div class="actions">
            <Show
              when={!(answered()?.userSaidTheyRememberedCorrectly as boolean)}
            >
              <button class="button failure" onClick={confirmForgot}>
                Continue
              </button>
            </Show>

            <Show when={answered()?.userSaidTheyRememberedCorrectly}>
              <button class="button failure" onClick={confirmForgot}>
                Incorrect
              </button>
              <button class="button success" onClick={confirmRemembered}>
                Correct
              </button>
            </Show>
          </div>
        </Show>
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
