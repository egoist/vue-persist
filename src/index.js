export default function (Vue, {
  name: defaultStoreName = 'persist:store',
  get = k => localStorage.getItem(k),
  set = (k, v) => localStorage.setItem(k, v)
} = {}) {
  const cache = {}

  Vue.prototype.$persist = function (names, storeName = defaultStoreName) {
    const data = cache[storeName] = JSON.parse(get(storeName) || '{}')

    for (const name of names) {
      if (typeof data[name] !== 'undefined') {
        this[name] = data[name]
      }

      this._persistWatchers = this._persistWatchers || []

      if (this._persistWatchers.indexOf(name) === -1) {
        this._persistWatchers.push(name)

        this.$watch(name, val => {
          data[name] = val
          set(storeName, JSON.stringify(data))
        })
      }
    }
  }
}
