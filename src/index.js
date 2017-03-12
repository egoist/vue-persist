export default function (Vue, {
  name: defaultStoreName = 'persist:store',
  expiration: defaultExpiration,
  read = k => localStorage.getItem(k),
  write = (k, v) => localStorage.setItem(k, v),
  clear = k => localStorage.removeItem(k)
} = {}) {
  const cache = {}

  Vue.prototype.$persist = function (names, storeName = defaultStoreName, storeExpiration = defaultExpiration) {
    let store = cache[storeName] = JSON.parse(read(storeName) || '{}')
    store.data = store.data || {}

    if (isExpired(store.expiration)) {
      clear(storeName)
      store = { data: {}, expiration: getExpiration(storeExpiration) }
    }

    if (!store.expiration) {
      store.expiration = getExpiration(storeExpiration)
    }

    for (const name of names) {
      if (typeof store.data[name] !== 'undefined') {
        this[name] = store.data[name]
      }

      this._persistWatchers = this._persistWatchers || []

      if (this._persistWatchers.indexOf(name) === -1) {
        this._persistWatchers.push(name)

        this.$watch(name, val => {
          store.data[name] = val
          write(storeName, JSON.stringify(store))
        })
      }
    }
  }
}

function getExpiration(exp) {
  return exp ? Date.now() + exp : 0
}

function isExpired(exp) {
  return exp && (Date.now() > exp)
}
