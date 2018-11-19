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

store.dispatch('addTable', 6)

// ------------------------------------------
// ACTIONS INTERFACE
// ------------------------------------------
new Vue({
    el: '#interface',
    store,
    data: {
        inputText: ''
    },
    methods: {
        inputSend (val) {
            this.inputText = this.inputText.replace(/\D+/g, '').slice(0,2)
            this.$store.dispatch('changeText', this.inputText)
        }
    },
    mounted () {
        this.$store.subscribe((mutation, state) => {
            this.$forceUpdate()
        })
        this.$store.subscribeAction((action, state) => {
            this.$forceUpdate()
        })
    }
})