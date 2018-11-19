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
// THE STORE
// ------------------------------------------
const defy = 22 * 14
const defx = 22 * 19
function defL (num = 14) {
    return 22 * num
}

const store = new Vuex.Store({
    state: {
        d: SVG('drawing').size('100%', '100%').viewbox(0, 0, 1024, 768),
        selectedElement: null,
        selectedElementText: null,
        editorMenu: true,
        elementMenu: false,
        tableCount: 1,
        defs: {
            selectOptionsLine: {pointSize: 22, rotationPoint: false, deepSelect: true},
            selectClass: 'selected-element',
            dragOptions: {snapToGrid: 11},
            dragOptions2: {snapToGrid: 22},
            resizeOptions: {snapToGrid: 11, snapToAngle: 45},
            startPos: [defx, defy],
            lineStartDots: [ [defx, defy], [defL(24), defy] ],
            table: {
                width: 66,
                widthB: 88,
                height: 66,
                radius: 4,
                fill: '#fff',
                text: {
                    font: {
                        size: '40px',
                        fill: '#646666',
                        family: 'SF, Helvetica, Arial, sans-serif'
                    },
                    pos: [10, 15]
                },
                icon: {
                    pos: [32, 6],
                    posB: [52, 6],
                    fontPos: [50, 0],
                    fontPosB: [72, 0],
                    font: {
                        size: '17px',
                        fill: '#8FACB3',
                        family: 'SF, Helvetica, Arial, sans-serif'
                    }
                }
            },
            text: {
                font: {
                    size: 40,
                    family: 'SF, sans-serif'
                }
            },
            line: {
                stroke: {
                    width: 22,
                    color: '#e1e5e6',
                    linecap: 'round'
                },
                fill: 'none'
            },
            line2: {
                stroke: {
                    width: 22,
                    color: '#ebd7ce',
                    linecap: 'round'
                },
                fill: 'none'
            },
            glass: {
                stroke: {
                    color: '#84d4fb',
                    width: 11,
                    linecap: 'round',
                    dasharray: '110 11'
                }
            }
        }
    },
    mutations: {
        setSelectedEl (state, el) {
            state.selectedElement = el
        },
        setEditorMenu (state, val) {
            state.editorMenu = val
        },
        setElementMenu (state, val) {
            state.elementMenu = val
            if (state.selectedElement && state.selectedElement.select('text').length()) {
                state.selectedElementText = state.selectedElement.select('text').first().text()
            }
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

        // ----------- ELEMENTS` ACTIONS ->
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
            if (elem.attr().restotype === 'table') elem.draggable(state.defs.dragOptions2)
            else elem.draggable(state.defs.dragOptions)
            if (elem.type === 'line')
                elem.selectize(state.defs.selectOptionsLine).resize(state.defs.resizeOptions)
            else
                elem.addClass(state.defs.selectClass)
            commit('setElementMenu', true)
            commit('setEditorMenu', false)
        },
        unselectAll ({ state, commit }) {
            commit('setSelectedEl', null)
            commit('setElementMenu', false)
            commit('setEditorMenu', true)
            state.d.each(function (i) {
                this.selectize(false, {deepSelect: true}).resize(false)
                if (this.hasClass(state.defs.selectClass)) this.removeClass(state.defs.selectClass)
            })
        },
        copyElement ({ state, dispatch, commit }) {
            if (state.selectedElement) {
                let elNew = state.selectedElement.clone()
                elNew.draggable(state.defs.dragOptions).dmove(44, 44)
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
            if (state.selectedElement && state.selectedElement.select('text').length()) {
                state.selectedElement.select('text').first().text(text)
            }
        },

        // ----------- CREATION ACTIONS ->
        addTable ({ state, dispatch, commit }, int = 2) {
            let group = state.d.group()
            let num = state.d.text(String(state.tableCount))
                .move(...state.defs.table.text.pos)
                .font(state.defs.table.text.font)
            let table = int > 3 ? state.d.rect(state.defs.table.widthB, state.defs.table.height) : state.d.rect(state.defs.table.width, state.defs.table.height)
                table.fill(state.defs.table.fill).radius(state.defs.table.radius)
            let peopleNum = state.d.group()
            let sofapos = int > 3 ? state.defs.table.icon.posB : state.defs.table.icon.pos
            let sofa = state.d.use('sofaGrey', 'img/sofa-grey.svg').move(...sofapos)
            let numpos = int > 3 ? state.defs.table.icon.fontPosB : state.defs.table.icon.fontPos
            let num2 = state.d.text(String(int)).font(state.defs.table.icon.font).move(...numpos)

            peopleNum.add(sofa).add(num2)

            group.add(table).add(num).add(peopleNum).move(...state.defs.startPos).draggable(state.defs.dragOptions2).addClass('table').attr('restotype', 'table')


            commit('increaseTable')

            dispatch('registerSelectElement', group)
        },
        addText ({ state, dispatch }) {
            let text = 'Text'
            let textBlock = state.d.text(text)
                .draggable(state.defs.dragOptions)
                .font(state.defs.text.font)
                .move(...state.defs.startPos)

            dispatch('registerSelectElement', textBlock)
        },
        addLine ({ state, dispatch }) {
            let line = state.d.line(state.defs.lineStartDots).stroke(state.defs.line.stroke).draggable(state.defs.dragOptions).attr('restotype', 'wall')
            dispatch('registerSelectElement', line)
        },
        addLine2 ({ state, dispatch }) {
            let line = state.d.line(state.defs.lineStartDots).stroke(state.defs.line2.stroke).draggable(state.defs.dragOptions).attr('restotype', 'bar')
            dispatch('registerSelectElement', line)
        },
        addGlass ({ state, dispatch }) {
            let line = state.d.line(state.defs.lineStartDots).stroke(state.defs.glass.stroke).draggable(state.defs.dragOptions).attr('restotype', 'window')
            dispatch('registerSelectElement', line)
        },
        addDecor ({ state, dispatch }) {
            let decor = state.d.image('img/decor.svg').draggable(state.defs.dragOptions).move(...state.defs.startPos).attr('restotype', 'decor')
            dispatch('registerSelectElement', decor)
        },

        // ----------- EXPORT ->
        exportData ({ state }) {
            let expData = {

            }
            state.d.each(function () {
                this.draggable(false)
                    .selectize(false, {deepSelect: true})
                    .resize(false)
                if (this.node.children[0] && this.node.children[0].classList.contains('svg_select_points')) this.remove()
            })
        }
    }
})

export default store
