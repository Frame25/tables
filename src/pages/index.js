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

window.D = store.state.d
window.S = store

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
            this.elementText = this.$store.state.selectedElementText
            this.tableNum = this.$store.state.selectedElementText
            this.guestNum = this.$store.state.selectedElementGuests
        })
        this.$store.subscribeAction((action, state) => {
            this.$forceUpdate()
        })
    }
})