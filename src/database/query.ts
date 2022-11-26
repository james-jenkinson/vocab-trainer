import { liveQuery } from 'dexie'
import { Accessor, createSignal, onCleanup } from 'solid-js'

export const query = <T>(
  callback: () => Promise<T>
): Accessor<T | undefined> => {
  const [signal, setSignal] = createSignal<T>()

  const observable = liveQuery(callback)

  const sub = observable.subscribe((val) => {
    setSignal(() => val)
  })

  onCleanup(() => {
    sub.unsubscribe()
  })

  return signal
}
