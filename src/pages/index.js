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

store.dispatch('addTable', {guests: 6, number: 33, position: [300, 200]})
store.dispatch('addTable', {guests: 2, position: [300, 300]})
store.dispatch('addTable')

window.D = store.state.d

// ------------------------------------------
// ACTIONS INTERFACE
// ------------------------------------------
new Vue({
    el: '#interface',
    store,
    data: {
        elementText: '',
        tableNum: '',
        guestNum: ''
    },
    methods: {
        elementTextSend (val) {
            this.$store.dispatch('changeText', this.elementText)
        },
        tableNumSend (val) {
            this.tableNum = this.tableNum.replace(/\D+/g, '').slice(0,2)
            this.$store.dispatch('changeText', this.tableNum)
        },
        guestNumSend (val) {
            this.guestNum = this.guestNum.replace(/\D+/g, '').slice(0,1)
            this.$store.dispatch('changeGuestNum', this.guestNum)
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