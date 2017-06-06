export default function (Vue, {
  name: defaultStoreName = 'persist:store',
  expiration: defaultExpiration,
  read = k => localStorage.getItem(k),
  write = (k, v) => localStorage.setItem(k, v),
  clear = k => localStorage.removeItem(k)
} = {}) {
  const cache = {}

  Vue.prototype.$persist = function (names, storeName = defaultStoreName, storeExpiration = defaultExpiration) {
    let changed = false
    let store = cache[storeName] = JSON.parse(read(storeName) || '{}')
    store.data = store.data || {}

    if (isExpired(store.expiration)) {
      clear(storeName)
      store = {
        data: {},
        expiration: getExpiration(storeExpiration)
      }
    }

    if (!store.expiration) {
      store.expiration = getExpiration(storeExpiration)
    }

    this._persistWatchers = this._persistWatchers || []

    for (const name of names) {
      if (typeof store.data[name] !== 'undefined') {
        this[name] = store.data[name]
      }

      if (this._persistWatchers.indexOf(name) === -1) {
        this._persistWatchers.push(name)

        this.$watch(name, val => {
          store.data[name] = val
          if (!changed) {
            changed = true
            this.$nextTick(() => {
              if (changed) {
                write(storeName, JSON.stringify(store))
                changed = false
              }
            })
          }
        }, {deep: true})
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
