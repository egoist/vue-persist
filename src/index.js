export default function (Vue, {
  name: defaultStoreName = 'persist:store',
  expiration: defaultExpiration,
  read = k => localStorage.getItem(k),
  write = (k, v) => localStorage.setItem(k, v),
  clear = k => localStorage.removeItem(k)
} = {}) {
  let cache = {}
  const isExpired = expiration => expiration && new Date().getTime() > expiration

  Vue.prototype.$persist = function (names, storeName = defaultStoreName, storeExpiration = defaultExpiration) {
    let { expiration, data = {} } = cache[storeName] = JSON.parse(read(storeName) || '{}')

    if (isExpired(expiration)) {
      clear(storeName)
      cache[storeName] = null
    }

    if (!expiration) {
      const d = new Date()
      expiration = storeExpiration ? d.setDate(d.getDate() + storeExpiration) : 0
    }

    for (const name of names) {
      if (typeof data[name] !== 'undefined') {
        this[name] = data[name]
      }

      this._persistWatchers = this._persistWatchers || []

      if (this._persistWatchers.indexOf(name) === -1) {
        this._persistWatchers.push(name)

        this.$watch(name, val => {
          data[name] = val
          write(storeName, JSON.stringify({ data, expiration }))
        })
      }
    }
  }
}
