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

let lastMap = window.localStorage.getItem('restoclub_last_map')
if (lastMap) {
    let json = JSON.parse(lastMap)
    if (json.elements && json.elements.length) {
        json.elements.forEach(el => {
            switch (el.type) {
                case 'table':
                    store.dispatch('addTable', {
                        position: [el.x, el.y],
                        number: el.number,
                        guests: el.guests
                    })
                    break
                case 'text':
                    store.dispatch('addText', {
                        text: el.text,
                        position: [el.x, el.y],
                    })
                    break
                case 'wall':
                    store.dispatch('addWall', {
                        dots: el.dots
                    })
                    break
                case 'bar':
                    store.dispatch('addBar', {
                        dots: el.dots
                    })
                    break
                case 'glass':
                    store.dispatch('addGlass', {
                        dots: el.dots
                    })
                    break
                case 'decor':
                    store.dispatch('addDecor', {
                        position: [el.x, el.y]
                    })
                    break
            }
        })
    }
}

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