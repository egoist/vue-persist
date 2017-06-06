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
        set(this, name, store.data[name])
      }

      if (this._persistWatchers.indexOf(name) === -1) {
        this._persistWatchers.push(name)

        this.$watch(name, val => {
          store.data[name] = val
          write(storeName, JSON.stringify(store))
        }, { deep: true })
      }
    }
  }
}

const BRACKET_RE_S = /\['([^']+)'\]/g
const BRACKET_RE_D = /\["([^"]+)"\]/g

function getExpiration(exp) {
  return exp ? Date.now() + exp : 0
}

function isExpired(exp) {
  return exp && (Date.now() > exp)
}

function normalizeKeypath(key) {
  return key.indexOf('[') < 0 ?
    key :
    key.replace(BRACKET_RE_S, '.$1')
      .replace(BRACKET_RE_D, '.$1')
}

function set(obj, key, val) {
  key = normalizeKeypath(key)
  if (key.indexOf('.') < 0) {
    obj[key] = val
    return
  }
  let d = -1
  const path = key.split('.')
  const l = path.length - 1
  while (++d < l) {
    if (obj[path[d]] === null) {
      obj[path[d]] = {}
    }
    obj = obj[path[d]]
  }
  obj[path[d]] = val
}
