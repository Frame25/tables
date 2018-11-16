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
const store = new Vuex.Store({
  state: {
    d: SVG('drawing').size('100%', '100%').viewbox(0, 0, 1024, 768),
    selectedElement: null,
    editorMenu: true,
    elementMenu: false,
    tableCount: 1,
    defs: {
      selectOptionsLine: {pointSize: 22, rotationPoint: false, deepSelect: true},
      selectClass: 'selected-element',
      dragOptions: {snapToGrid: 22},
      resizeOptions: {snapToGrid: 22, snapToAngle: 45},
      startPos: [22, 22],
      lineStartDots: [ [22, 22], [132, 22] ],
      table: {
        width: 66,
        height: 66,
        radius: 4,
        fill: '#fff',
        text: {
          font: {
            size: '40px',
            fill: 'grey',
            family: 'SF, sans-serif'
          },
          pos: [10, 15]
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
    registerSelectElement ({ state, dispatch, commit }, elem) {
      elem.click(event => {
        event.stopPropagation()
        dispatch('unselectAll')
        commit('setSelectedEl', elem)
        elem.draggable(state.defs.dragOptions)
        if (elem.type === 'line')
          elem.selectize(state.defs.selectOptionsLine).resize(state.defs.resizeOptions)
        else
          elem.addClass(state.defs.selectClass)
        commit('setElementMenu', true)
        commit('setEditorMenu', false)
      })
      elem.touchstart(event => {
        event.stopPropagation()
        dispatch('unselectAll')
        commit('setSelectedEl', elem)
        elem.draggable(state.defs.dragOptions)
        if (elem.type === 'line')
          elem.selectize(state.defs.selectOptionsLine).resize(state.defs.resizeOptions)
        else
          elem.addClass(state.defs.selectClass)
        commit('setElementMenu', true)
        commit('setEditorMenu', false)
      })
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
        if (state.selectedElement.type === 'rect') commit('increaseTable')
        let elNew = state.selectedElement.clone()
        elNew.draggable(state.defs.dragOptions).dmove(44, 44)
        dispatch('registerSelectElement', elNew)
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

    // ----------- CREATION ACTIONS ->
    addTable ({ state, dispatch, commit }) {
      let group = state.d.group()
      let num = state.d.text(String(state.tableCount))
      .move(...state.defs.table.text.pos)
      .font(state.defs.table.text.font)
      let table = state.d.rect(state.defs.table.width, state.defs.table.height)
      .fill(state.defs.table.fill)
      .radius(state.defs.table.radius)
    
      group.add(table).add(num).move(...state.defs.startPos).draggable(state.defs.dragOptions)
    
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
      let line = state.d.line(state.defs.lineStartDots).stroke(state.defs.line.stroke).draggable(state.defs.dragOptions)
      dispatch('registerSelectElement', line)
    },
    addLine2 ({ state, dispatch }) {
      let line = state.d.line(state.defs.lineStartDots).stroke(state.defs.line2.stroke).draggable(state.defs.dragOptions)
      dispatch('registerSelectElement', line)
    },
    addGlass ({ state, dispatch }) {
      let line = state.d.line(state.defs.lineStartDots).stroke(state.defs.glass.stroke).draggable(state.defs.dragOptions)
      dispatch('registerSelectElement', line)
    },
    addDecor ({ state, dispatch }) {
      let decor = state.d.image('img/decor.svg').draggable(state.defs.dragOptions).move(...state.defs.startPos)
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
