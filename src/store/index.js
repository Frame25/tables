import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import SVG from 'svg.js'
import draggable from '../libs/draggable/draggable'
import resize from '../libs/resize/resize'
import select from '../libs/select/select.js'

// ------------------------------------------
// GLOBAL LIBS
// ------------------------------------------
draggable.call(this, SVG)
select.call(this, SVG)
resize.call(this, SVG)

// ------------------------------------------
// DEFAULTS
// ------------------------------------------
const defGrid = 22
const defY = defGrid * 14
const defX = defGrid * 19
function xGrid (num = 14) {
    return defGrid * num
}
const defs = {
    selectOptionsLine: {pointSize: defGrid, rotationPoint: false, deepSelect: true},
    selectClass: 'selected-element',
    dragOptions: {snapToGrid: xGrid(0.5)},
    dragOptions2: {snapToGrid: defGrid},
    resizeOptions: {snapToGrid: xGrid(0.5), snapToAngle: 45},
    startPos: [defX, defY],
    lineStartDots: [ [defX, defY], [xGrid(24), defY] ],
    table: {
        width: xGrid(3),
        widthB: xGrid(4),
        height: xGrid(3),
        radius: 4,
        fill: '#fff',
        numberFont: {
            size: 40,
            fill: '#646666',
            family: 'SFD, Helvetica, Arial, sans-serif',
            weight: 200
        },
        guestsFont: {
            size: '17px',
            fill: '#8FACB3',
            family: 'SFD, Helvetica, Arial, sans-serif',
            weight: 200
        }
    },
    textFont: {
        size: 40,
        family: 'SFD, sans-serif',
        weight: 200
    },
    wallStroke: {
        width: 22,
        color: '#e1e5e6',
        linecap: 'round'
    },
    barStroke: {
        width: 22,
        color: '#ebd7ce',
        linecap: 'round'
    },
    glassStroke: {
        color: '#84d4fb',
        width: 11,
        linecap: 'round',
        dasharray: '110 11'
    }
}

// ------------------------------------------
// THE STORE
// ------------------------------------------
const store = new Vuex.Store({
    state: {
        d: SVG('drawing').size('100%', '100%').viewbox(0, 0, 1024, 768),
        selectedElement: null,
        selectedElementText: null,
        selectedElementGuests: null,
        editorMenu: true,
        elementMenu: false,
        tableCount: 1
    },
    mutations: {
        setSelectedEl (state, el) {
            state.selectedElement = el
        },
        setSelectedElText (state, val) {
            state.selectedElementText = val
        },
        setSelectedElGuests (state, val) {
            state.selectedElementGuests = val
        },
        setEditorMenu (state, val) {
            state.editorMenu = val
        },
        setElementMenu (state, val) {
            state.elementMenu = val
        },
        increaseTable (state, minus) {
            if (minus)
                state.tableCount--
            else
                state.tableCount++
        }
    },
    actions: {
        fillWithPattern ({ state }) {
            const pattern = state.d.pattern(22, 22, add => {
                add.rect(22, 22).fill('#f5f7f7')
                add.circle(2).fill('#C8CBCC')
            })
            state.d.rect('100%', '100%').fill(pattern)
        },

        // ----------- ELEMENTS` ACTIONS -->
        registerSelectElement ({ dispatch }, elem) {
            elem.click(event => {
                event.stopPropagation()
                dispatch('selectElement', elem)
            })
            elem.touchstart(event => {
                event.stopPropagation()
                dispatch('selectElement', elem)
            })
        },
        selectElement ({ state, dispatch, commit }, elem) {
            dispatch('unselectAll')
            commit('setSelectedEl', elem)
            if (elem.attr().restotype === 'table') {
                let txt = elem.select('.table-num').first().text()
                let gst = elem.select('.guests-num').first().text()
                commit('setSelectedElText', txt)
                commit('setSelectedElGuests', gst)
                elem.draggable(defs.dragOptions2)
            }
            else {
                if (elem.type === 'text') commit('setSelectedElText', elem.text())
                elem.draggable(defs.dragOptions)
            }

            if (elem.type === 'line') elem.selectize(defs.selectOptionsLine).resize(defs.resizeOptions)
            else elem.addClass(defs.selectClass)

            commit('setElementMenu', true)
            commit('setEditorMenu', false)
        },
        unselectAll ({ state, commit }) {
            commit('setSelectedEl', null)
            commit('setElementMenu', false)
            commit('setEditorMenu', true)
            state.d.each(function () {
                this.selectize(false, {deepSelect: true}).resize(false)
                if (this.hasClass(defs.selectClass)) this.removeClass(defs.selectClass)
            })
        },
        copyElement ({ state, dispatch, commit }) {
            if (state.selectedElement) {
                let elNew = state.selectedElement.clone()
                elNew.draggable(defs.dragOptions).dmove(xGrid(2), xGrid(2))
                dispatch('registerSelectElement', elNew)
                dispatch('unselectAll')
                dispatch('selectElement', elNew)
                if (elNew.attr().restotype === 'table') {
                    dispatch('changeText', String(state.tableCount))
                    commit('increaseTable')
                }
            }
        },
        removeElement({ state, dispatch }) {
            if (state.selectedElement) {
                state.selectedElement.selectize(false, {deepSelect: true})
                    .resize(false)
                    .draggable(false)
                    .remove()
                dispatch('unselectAll')
            }
        },
        clearAll ({ state, dispatch }) {
            state.d.clear()
            dispatch('fillWithPattern')
        },
        rotateElement ({ state }, left) {
            let rotate = state.selectedElement.transform().rotation
            left ? rotate -= 90 : rotate += 90
            state.selectedElement.transform({ rotation: rotate })
        },
        changeText ({ state }, text) {
            if (state.selectedElement && state.selectedElement.type === 'text') {
                if (text === '') text = 'Text'
                state.selectedElement.text(text)
            } else if (state.selectedElement && state.selectedElement.select('.table-num').length()) {
                if (text === '') text = '00'
                let w = state.selectedElement.select('rect').first().width()
                state.selectedElement.select('.table-num').first().text(text).cx(w / 2)
            }
        },
        changeGuestNum ({ state }, text) {
            if (state.selectedElement && state.selectedElement.select('.guests-num').length()) {
                if (text === '') text = '1'
                state.selectedElement.select('.guests-num').first().text(text)
            }
        },

        // ----------- CREATION ACTIONS -->
        addTable ({ state, dispatch, commit }, { guests = 2, number = null, position = null } = {}) {
            // params: { guests: Number, number: Number, position: Array(x, y) }

            let tableWidth = guests > 3 ? defs.table.widthB : defs.table.width
            let tableEl = state.d.group()
            let rect = state.d.rect(tableWidth, defs.table.height).fill(defs.table.fill).radius(defs.table.radius)
            let tableNum = state.d.text(String(number || state.tableCount)).font(defs.table.numberFont).addClass('table-num').y(20).cx(tableWidth / 2)
            let guestsEl = state.d.group().y(9).x(tableWidth - 35)
            let sofa = state.d.use('sofaGrey', 'img/sofa-grey.svg').y(0).x(0)
            let guestsNum = state.d.text(String(guests)).font(defs.table.guestsFont).addClass('guests-num').y(-5).x(20)

            guestsEl.add(sofa).add(guestsNum)
            tableEl.add(rect).add(tableNum).add(guestsEl).move(...(position || defs.startPos)).draggable(defs.dragOptions2).addClass('table').attr('restotype', 'table')

            commit('increaseTable')
            dispatch('registerSelectElement', tableEl)
        },
        addText ({ state, dispatch }, { text = 'Text', position = null } = {}) {
            // params: { text: String, position: Array(x, y) }
            let textBlock = state.d.text(text)
                .draggable(defs.dragOptions)
                .font(defs.textFont)
                .move(...(position || defs.startPos))

            dispatch('registerSelectElement', textBlock)
        },
        addWall ({ state, dispatch }, { dots = null } = {}) {
            // params: { dots: Array( Array(x, y), Array(x, y) ) }
            let wall = state.d.line(dots || defs.lineStartDots).stroke(defs.wallStroke).draggable(defs.dragOptions).attr('restotype', 'wall')
            dispatch('registerSelectElement', wall)
        },
        addBar ({ state, dispatch }, { dots = null } = {}) {
            // params: { dots: Array( Array(x, y), Array(x, y) ) }
            let bar = state.d.line(dots || defs.lineStartDots).stroke(defs.barStroke).draggable(defs.dragOptions).attr('restotype', 'bar')
            dispatch('registerSelectElement', bar)
        },
        addGlass ({ state, dispatch }, { dots = null } = {}) {
            // params: { dots: Array( Array(x, y), Array(x, y) ) }
            let glass = state.d.line(dots || defs.lineStartDots).stroke(defs.glassStroke).draggable(defs.dragOptions).attr('restotype', 'window')
            dispatch('registerSelectElement', glass)
        },
        addBarnchair ({ state, dispatch }, { position = null } = {}) {
            // params: { position: Array(x, y) }
            let decor = state.d.image('img/barnchair.svg').draggable(defs.dragOptions).move(...(position || defs.startPos)).attr('restotype', 'barnchair')
            dispatch('registerSelectElement', decor)
        },
        addDecor ({ state, dispatch }, { position = null } = {}) {
            // params: { position: Array(x, y) }
            let decor = state.d.image('img/decor.svg').draggable(defs.dragOptions).move(...(position || defs.startPos)).attr('restotype', 'decor')
            dispatch('registerSelectElement', decor)
        },
        addDecor2 ({ state, dispatch }, { position = null } = {}) {
            // params: { position: Array(x, y) }
            let decor = state.d.image('img/decor2.svg').draggable(defs.dragOptions).move(...(position || defs.startPos)).attr('restotype', 'decor2')
            dispatch('registerSelectElement', decor)
        },
        addDecorMulti ({ state, dispatch }, { position = null, type = 'decor' } = {}) {
            // params: { position: Array(x, y) }
            if (type !== 'decor' && type !== 'decor2' && type !== 'barnchair') {
                console.log('unregistered type of decor')
                return false
            }
            let decor = state.d.image('img/' + type + '.svg').draggable(defs.dragOptions).move(...(position || defs.startPos)).attr('restotype', type)
            dispatch('registerSelectElement', decor)
        },

        // ----------- EXPORT -->
        exportData ({ state, dispatch }) {
            let expData = {
                uuid: '',
                width: state.d.viewbox().width,
                height: state.d.viewbox().height,
                elements: []
            }
            dispatch('unselectAll')
            state.d.each(function () {
                this.draggable(false)
                    .selectize(false, {deepSelect: true})
                    .resize(false)

                let type = this.attr('restotype')
                switch (type) {
                    case 'table':
                        expData.elements.push({
                            type,
                            x: this.x(),
                            y: this.y(),
                            number: this.select('.table-num').first().text(),
                            guests: this.select('.guests-num').first().text()
                        })
                        break
                    case 'text':
                        expData.elements.push({
                            type,
                            x: this.x(),
                            y: this.y(),
                            text: this.text()
                        })
                        break
                    case 'wall':
                        expData.elements.push({
                            type,
                            dots: this.array().value
                        })
                        break
                    case 'bar':
                        expData.elements.push({
                            type,
                            dots: this.array().value
                        })
                        break
                    case 'glass':
                        expData.elements.push({
                            type,
                            dots: this.array().value
                        })
                        break
                    case 'decor':
                        expData.elements.push({
                            type,
                            x: this.x(),
                            y: this.y()
                        })
                        break
                    case 'decor2':
                        expData.elements.push({
                            type,
                            x: this.x(),
                            y: this.y()
                        })
                        break
                    case 'barnchair':
                        expData.elements.push({
                            type,
                            x: this.x(),
                            y: this.y()
                        })
                        break

                }
            })
            window.localStorage.setItem('restoclub_last_map', JSON.stringify(expData))
            console.log(expData)
            window.postMessage(JSON.stringify(expData))
        }
    }
})

export default store