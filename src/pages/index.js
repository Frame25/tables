import '../sass/style.sass'
import '../libs/select/select.css'
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
// DRAW VARS
// ------------------------------------------
const imgTable = 'data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9JzMwMHB4JyB3aWR0aD0nMzAwcHgnICBmaWxsPSIjMDAwMDAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgNTAgNTAiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDUwIDUwIiB4bWw6c3BhY2U9InByZXNlcnZlIj48Zz48cGF0aCBmaWxsPSIjMDAwMDAwIiBkPSJNNDQuMTEzLDI0LjY5OWMwLDQuODg5LTguNTI5LDguODU0LTE5LjA0OSw4Ljg1NGMtMTAuNTIxLDAtMTkuMDUyLTMuOTY1LTE5LjA1Mi04Ljg1NCAgIGMwLTQuODg3LDguNTMtOC44NSwxOS4wNTItOC44NUMzNS41ODQsMTUuODUsNDQuMTEzLDE5LjgxMyw0NC4xMTMsMjQuNjk5eiI+PC9wYXRoPjxnPjxwYXRoIGZpbGw9IiMwMDAwMDAiIGQ9Ik0yMy44NTcsMTIuMjkxYzAsMS4yMDUtMC43MDEsMi4xODQtMS41NjUsMi4xODRoLTguODQ0Yy0wLjg2NSwwLTEuNTY2LTAuOTc5LTEuNTY2LTIuMTg0bDAsMCAgICBjMC0xLjIwMywwLjcwMS0yLjE4MiwxLjU2Ni0yLjE4Mmg4Ljg0NEMyMy4xNTYsMTAuMTA5LDIzLjg1NywxMS4wODgsMjMuODU3LDEyLjI5MUwyMy44NTcsMTIuMjkxeiI+PC9wYXRoPjxwYXRoIGZpbGw9IiMwMDAwMDAiIGQ9Ik0zOC4yNDYsMTIuMjkxYzAsMS4yMDUtMC43MDEsMi4xODQtMS41NjgsMi4xODRoLTguODRjLTAuODY5LDAtMS41NjgtMC45NzktMS41NjgtMi4xODRsMCwwICAgIGMwLTEuMjAzLDAuNjk5LTIuMTgyLDEuNTY4LTIuMTgyaDguODRDMzcuNTQ1LDEwLjEwOSwzOC4yNDYsMTEuMDg4LDM4LjI0NiwxMi4yOTFMMzguMjQ2LDEyLjI5MXoiPjwvcGF0aD48L2c+PGc+PHBhdGggZmlsbD0iIzAwMDAwMCIgZD0iTTIzLjg1NywzNy43MTFjMCwxLjIwNS0wLjcwMSwyLjE4LTEuNTY1LDIuMThoLTguODQ0Yy0wLjg2NSwwLTEuNTY2LTAuOTc1LTEuNTY2LTIuMThsMCwwICAgIGMwLTEuMjA1LDAuNzAxLTIuMTgyLDEuNTY2LTIuMTgyaDguODQ0QzIzLjE1NiwzNS41MjksMjMuODU3LDM2LjUwNiwyMy44NTcsMzcuNzExTDIzLjg1NywzNy43MTF6Ij48L3BhdGg+PHBhdGggZmlsbD0iIzAwMDAwMCIgZD0iTTM4LjI0NiwzNy43MTFjMCwxLjIwNS0wLjcwMSwyLjE4LTEuNTY4LDIuMThoLTguODRjLTAuODY5LDAtMS41NjgtMC45NzUtMS41NjgtMi4xOGwwLDAgICAgYzAtMS4yMDUsMC42OTktMi4xODIsMS41NjgtMi4xODJoOC44NEMzNy41NDUsMzUuNTI5LDM4LjI0NiwzNi41MDYsMzguMjQ2LDM3LjcxMUwzOC4yNDYsMzcuNzExeiI+PC9wYXRoPjwvZz48cGF0aCBmaWxsPSIjMDAwMDAwIiBkPSJNMy4wMDksMTguNzE1YzEuMTQ0LDAsMi4wNzIsMC42OTksMi4wNzIsMS41NjN2OC44NDRjMCwwLjg2NS0wLjkyOSwxLjU2OC0yLjA3MiwxLjU2OGwwLDAgICBjLTEuMTQxLDAtMi4wNjktMC43MDMtMi4wNjktMS41Njh2LTguODQ0QzAuOTQsMTkuNDE0LDEuODY5LDE4LjcxNSwzLjAwOSwxOC43MTVMMy4wMDksMTguNzE1eiI+PC9wYXRoPjxwYXRoIGZpbGw9IiMwMDAwMDAiIGQ9Ik00Ny4wNDcsMTguNzE1YzEuMTExLDAsMi4wMTQsMC42OTksMi4wMTQsMS41NjN2OC44NDRjMCwwLjg2NS0wLjkwMiwxLjU2OC0yLjAxNCwxLjU2OGwwLDAgICBjLTEuMTEzLDAtMi4wMTYtMC43MDMtMi4wMTYtMS41Njh2LTguODQ0QzQ1LjAzMSwxOS40MTQsNDUuOTM0LDE4LjcxNSw0Ny4wNDcsMTguNzE1TDQ3LjA0NywxOC43MTV6Ij48L3BhdGg+PC9nPjwvc3ZnPg=='
const d = SVG('drawing')
let pressed = false
let selectedElement = null
let btnAddTable = document.querySelector('.add-table')
let btnExport = document.querySelector('.export')
let btnAddText = document.querySelector('.add-text')
let btnAddLine = document.querySelector('.add-line')
let existElements = []
let exportObj = {
  root: {},
  elements: []
}
let defaults = {
  
  selectOptions: {pointSize: 15},
  dragOptions: {snapToGrid: 20},
  resizeOptions: {snapToGrid:20, snapToAngle:90},
  table: {
    x: 10,
    y: 10,
    width: 100,
    height: 100
  },
  text: {
    font: {
      size: 40
    },
    x: 10,
    y: 10
  },
  line: {
    dots: [
      [10, 10],
      [10, 30],
      [360, 30],
      [360, 10]

    ],
    stroke: {
      width: 5,
      color: '#b3b3b3'
    },
    fill: 'none'
  }
}

// ------------------------------------------
// UI VARS
// ------------------------------------------

const menu = document.querySelector('.block-menu')
const copyBtn = document.querySelector('.copy-element')
const removeBtn = document.querySelector('.remove-element')

// ------------------------------------------
// DRAW FUNCTIONS
// ------------------------------------------

d.click(unselectAll)
d.touchstart(unselectAll)

function selectElement (event, el) {
  event.stopPropagation()
  unselectAll(el)
  selectedElement = el
  el.selectize(defaults.selectOptions).resize(defaults.resizeOptions)
  showMenu()
}

// Unselect all elements
function unselectAll () {
  selectedElement = null
  hideMenu()
  existElements.forEach(el => {
    el.selectize(false)
  })
}

// Creates new table
function createTable () {
  let table = d.image(imgTable, 100, 100).draggable(defaults.dragOptions)
  table.click(event => {
    selectElement(event, table)
  })
  table.touchstart(event => {
    selectElement(event, table)
  })
  existElements.push(table)
}

// Creates new text block
function addText () {
  let text = prompt('Enter text')
  let textBlock = d.text(text).draggable(defaults.dragOptions).font(defaults.text.font)
  textBlock.click(event => {
    selectElement(event, textBlock)
  })
  textBlock.touchstart(event => {
    selectElement(event, textBlock)
  })
  existElements.push(textBlock)
}

// Creates new line
function addLine () {
  let line = d.polyline(defaults.line.dots).stroke(defaults.line.stroke).fill('#b3b3b3').draggable(defaults.dragOptions)
  line.click(event => {
    selectElement(event, line)
  })
  line.touchstart(event => {
    selectElement(event, line)
  })
  existElements.push(line)
}

// Copy selected element
function copyElement (event, el = selectedElement) {
  console.log(el)
  if (el) {
    let elNew = el.clone()
    elNew.draggable(defaults.snapToGrid)
    elNew.dx(10)
    elNew.dy(10)
    elNew.click(event => {
      selectElement(event, elNew)
    })
    elNew.touchstart(event => {
      selectElement(event, elNew)
    })
    existElements.push(elNew)
  }
}

// Removes selected element
function removeElement(event, el = selectedElement) {
  el.selectize(false)
  el.draggable(false)
  existElements.forEach((elem, index) => {
    if (elem.id() === el.id()) {
      existElements.splice(index, 1)
      return false
    }
  })
  el.remove()
}

// Exports result SVG & JSON without selections
function exportSvg () {
  exportObj.root = d.attr()

  existElements.forEach(x => {
    x.draggable(false)
    x.selectize(false)
    exportObj.elements.push({
      type: x.type,
      ...x.attr()
    })
  })

  exportObj.svg = d.svg()

  window.postMessage(JSON.stringify(exportObj))
  console.log(exportObj)
}

// ------------------------------------------
// UI FUNCTIONS
// ------------------------------------------

function showMenu () {
  if (!menu.classList.contains('show')) menu.classList.add('show')
}
function hideMenu() {
  if (menu.classList.contains('show')) menu.classList.remove('show')
}

// ------------------------------------------
// UI ACTIONS
// ------------------------------------------

btnAddTable.addEventListener('click', createTable)
btnAddText.addEventListener('click', addText)
btnAddLine.addEventListener('click', addLine)
copyBtn.addEventListener('click', copyElement)
removeBtn.addEventListener('click', removeElement)
btnExport.addEventListener('click', exportSvg)

// ------------------------------------------
// TEST
// ------------------------------------------
window.test = () => {
  return existElements
}