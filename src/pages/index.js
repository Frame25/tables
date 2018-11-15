import 'normalize.css'
import '../sass/style.sass'
import '../libs/select/select.css'
import Vue from 'vue'
import store from '../store/index'

// ------------------------------------------
// NO VUE LOGIC
// ------------------------------------------
store.dispatch('fillWithPattern')
store.state.d.click(() => {
  store.dispatch('unselectAll')
})

// ------------------------------------------
// ACTIONS INTERFACE
// ------------------------------------------
new Vue({
  el: '#interface',
  store,
  data: {},
  methods: {},
  mounted () {
    this.$store.subscribe((mutation, state) => {
      this.$forceUpdate()
    })
    this.$store.subscribeAction((action, state) => {
      this.$forceUpdate()
    })
  }
})