export function useStorage() {
  function get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key)
      if (raw === null) return fallback
      return JSON.parse(raw) as T
    } catch {
      return fallback
    }
  }

  function set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
      console.error(`Failed to write to localStorage key "${key}":`, e)
    }
  }

  function remove(key: string): void {
    localStorage.removeItem(key)
  }

  function getUsedBytes(): number {
    let total = 0
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('lotostats:')) {
        total += (localStorage.getItem(key) ?? '').length * 2
      }
    }
    return total
  }

  function getAllKeys(): string[] {
    const keys: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('lotostats:')) {
        keys.push(key)
      }
    }
    return keys
  }

  return { get, set, remove, getUsedBytes, getAllKeys }
}
