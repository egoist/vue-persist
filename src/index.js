export default function (Vue, options = {}) {
  const defaultStoreName = options.name || 'persist:store'

  const cache = {}

  Vue.prototype.$persist = function (names, storeName = defaultStoreName) {
    const data = cache[storeName] = JSON.parse(localStorage.getItem(storeName) || '{}')

    for (const name of names) {
      if (typeof data[name] !== 'undefined') {
        this[name] = data[name]
      }

      this._persistWatchers = this._persistWatchers || []

      if (this._persistWatchers.indexOf(name) === -1) {
        this._persistWatchers.push(name)

        this.$watch(name, val => {
          data[name] = val
          localStorage.setItem(storeName, JSON.stringify(data))
        })
      }
    }
  }
}
