export class StorageManager<T> {
  private readonly key: string
  private readonly defaultValue: T

  constructor(key: string, defaultValue: T) {
    this.key = key
    this.defaultValue = defaultValue
  }

  get(): T {
    if (typeof window === 'undefined') return this.defaultValue
    const json = localStorage.getItem(this.key)
    if (json === undefined || json === null || json === '')
      return this.defaultValue
    try {
      return JSON.parse(json || '') || this.defaultValue
    } catch (e) {
      console.error(`Unable to get data for storage key ${this.key}`, e)
      return this.defaultValue
    }
  }

  set(data: T) {
    localStorage.setItem(this.key, JSON.stringify(data))
  }

  clear() {
    localStorage.removeItem(this.key)
  }
}
