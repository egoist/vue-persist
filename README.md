# vue-persist

[![NPM version](https://img.shields.io/npm/v/vue-persist.svg?style=flat)](https://npmjs.com/package/vue-persist) [![NPM downloads](https://img.shields.io/npm/dm/vue-persist.svg?style=flat)](https://npmjs.com/package/vue-persist) [![Build Status](https://img.shields.io/circleci/project/egoist/vue-persist/master.svg?style=flat)](https://circleci.com/gh/egoist/vue-persist) [![donate](https://img.shields.io/badge/$-donate-ff69b4.svg?maxAge=2592000&style=flat)](https://github.com/egoist/donate)

> Persist data in localStorage or anywhere for Vue.js apps

## Install

```bash
yarn add vue-persist
```

## Usage

```js
import VuePersist from 'vue-persist'

Vue.use(VuePersist)

new Vue({
  template: '<input v-model="name" />',

  data: { name: '' },

  persist: ['name']
})
```

Then the data of `name` will be stored at localStorage and kept in sync.

Check out the [demo](https://egoistian.com/vue-persist), just type some words and refresh the page.

You can also manually call `this.$persist(['some-data'])` instead of using the component option.

## API

### Vue.use(VuePersist, [options])

#### options

##### name

Type: `string`<br>
Default: `persist:store`

The name of the localStorage store.

##### expiration

Type: `number`<br>
Default: `0`

Expire store in a specific amount of time (in millisecond), default to never expire.

##### read

Type: `function`<br>
Default: `k => localStorage.get(k)`

The function we use to get stored data.

##### write

Type: `function`<br>
Default: `(k, v) => localStorage.set(k, v)`

The function we use to store data.

##### clear

Type: `function`<br>
Default: `k => localStorage.removeItem(k)`

The function we use to clear data in store.


### this.$persist(keys[, name, expiration])

#### keys

Type: `Array`<br>
Required: `true`

Array of keys of state you want to keep in sync with localStorage.

#### name

Type: `string`<br>
Default: `options.name`

#### expiration

Type: `number`<br>
Default: `options.expiration`


## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D


## Author

**vue-persist** © [egoist](https://github.com/egoist), Released under the [MIT](./LICENSE) License.<br>
Authored and maintained by egoist with help from contributors ([list](https://github.com/egoist/vue-persist/contributors)).

> [egoistian.com](https://egoistian.com) · GitHub [@egoist](https://github.com/egoist) · Twitter [@rem_rin_rin](https://twitter.com/rem_rin_rin)
