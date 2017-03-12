export default function (Vue, {
  name: defaultStoreName = 'persist:store',
  expires: defaultExpires = 0,
  read = k => localStorage.getItem(k),
  write = (k, v) => localStorage.setItem(k, v)
} = {}) {
  const cache = {}
  const clear = k => localStorage.removeItem(k)
  const isExpired = expires => expires && new Date().getTime() > expires

  Vue.prototype.$persist = function (names, storeName = defaultStoreName, storeExpires = defaultExpires) {
    const store = JSON.parse(read(storeName) || '{}')

    if (isExpired(store.expires)) {
      return clear(storeName)
    }

    const data = cache[storeName] = store.data || {}
    const d = new Date()
    const expires = store.expires ? store.expires
          : storeExpires ? d.setDate(d.getDate() + storeExpires) : 0

    for (const name of names) {
      if (typeof data[name] !== 'undefined') {
        this[name] = data[name]
      }

      this._persistWatchers = this._persistWatchers || []

      if (this._persistWatchers.indexOf(name) === -1) {
        this._persistWatchers.push(name)

        this.$watch(name, val => {
          data[name] = val

          write(storeName, JSON.stringify({
            data,
            expires
          }))
        })
      }
    }
  }
}
