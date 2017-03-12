import Vue from 'vue'
import VuePersist from '../src'

Vue.use(VuePersist, {
  name: 'store',
  expiration: 3
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
    handleInput({target}) {
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
