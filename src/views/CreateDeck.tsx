import { JSX } from 'solid-js'

const CreateDeck = (): JSX.Element => {
  let name!: HTMLInputElement

  const onSubmit = (e: Event): void => {
    e.preventDefault()
    console.log('e', e)
    console.log(name)
  }

  return (
    <main>
      <h1>Create Deck</h1>
      <form onSubmit={onSubmit}>
        <label for='input-create-deck-name'>Name</label>
        <input ref={name} id='input-create-deck-name' />
        <button type='submit'>Create</button>
      </form>
    </main>
  )
}

export default CreateDeck
