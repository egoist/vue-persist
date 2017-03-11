export default function (Vue, {
  name: defaultStoreName = 'persist:store',
  read = k => localStorage.getItem(k),
  write = (k, v) => localStorage.setItem(k, v)
} = {}) {
  const cache = {}

  Vue.prototype.$persist = function (names, storeName = defaultStoreName) {
    const data = cache[storeName] = JSON.parse(read(storeName) || '{}')

    for (const name of names) {
      if (typeof data[name] !== 'undefined') {
        this[name] = data[name]
      }

      this._persistWatchers = this._persistWatchers || []

      if (this._persistWatchers.indexOf(name) === -1) {
        this._persistWatchers.push(name)

        this.$watch(name, val => {
          data[name] = val
          write(storeName, JSON.stringify(data))
        })
      }
    }
  }
}
