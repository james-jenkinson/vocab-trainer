export const uniqueId = (prefix?: string): (() => string) => {
  let _id = 0

  return () => `${prefix ?? ''}-${++_id}`
}

export const uniqueNumber = (): (() => number) => {
  let _id = 0

  return () => ++_id
}
