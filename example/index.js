import Vue from 'vue'
import VuePersist from '../src'

Vue.use(VuePersist, {
  name: 'store',
  expiration: 1000 * 10 // 10s
})

new Vue({
  el: '#app',
  data: {
    name: ''
  },
  created() {
    this.$persist(['name'])
  },
  methods: {
    handleInput({ target }) {
      this.name = target.value
    }
  },
  render() {
    return (
      <div>
        <input type="text" value={this.name} onInput={this.handleInput} /> Your name?
      </div>
    )
  }
})
