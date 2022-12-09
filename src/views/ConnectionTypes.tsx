import { For, JSX } from 'solid-js'
import { Color, colors } from '../consts/colors'
import { db } from '../database/db'
import { query } from '../database/query'

const ConnectionTypes = (): JSX.Element => {
  let name!: HTMLInputElement
  let color!: HTMLSelectElement

  const connectionTypes = query(
    async () => await db.wordConnectionTypes.toArray()
  )

  const onSubmit = (event: Event): void => {
    event.preventDefault()

    db.wordConnectionTypes
      .add({
        name: name.value,
        color: color.value as Color
      })
      .then()
      .catch(console.error)
  }

  return (
    <main>
      <h1>Connection Types</h1>

      <ul>
        <For each={connectionTypes()}>
          {(connectionType) => <li>{connectionType.name}</li>}
        </For>
      </ul>

      <form onSubmit={onSubmit}>
        <label>Name</label>
        <input ref={name} class="input" />

        <label>Color</label>
        <select ref={color} class="input">
          <For each={Object.entries(colors)}>
            {([value, color]) => <option value={value}>{color.label}</option>}
          </For>
        </select>

        <button class="button">Create</button>
      </form>
    </main>
  )
}

export default ConnectionTypes
