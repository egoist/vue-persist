import Vue from 'vue'
import VuePersist from '../src'

Vue.use(VuePersist, {
  name: 'store',
  expiration: 1000 * 10 // 10s
})

new Vue({
  el: '#app',
  data: {
    name: '',
    model: {
      name: ''
    }
  },
  created() {
    this.$persist(['model.name'])
  },
  methods: {
    handleInput({ target }) {
      this.model.name = target.value
    }
  },
  render() {
    return (
      <div>
        <input type="text" value={this.model.name} onInput={this.handleInput} /> Your name?
      </div>
    )
  }
})
