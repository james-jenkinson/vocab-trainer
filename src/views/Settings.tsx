import { JSX } from 'solid-js'
// @ts-expect-error foo
import { useRegisterSW } from 'virtual:pwa-register/solid'
import { db } from '../database/db'
import './Settings.css'

const Settings = (): JSX.Element => {
  const onDelete = (): void => {
    db.delete().then(async () => await db.open()).catch(console.error)
  }

  const register = useRegisterSW()
  console.log('register', register)

  return (
    <main>
      <h1>Settings</h1>
      <div class="settings">
        <button class="button" onClick={onDelete}>
          Delete data
        </button>
        <button class="button" onClick={() => register?.updateServiceWorker()}>
          Update
        </button>
      </div>
    </main>
  )
}

export default Settings
