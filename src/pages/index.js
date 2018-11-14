import '../sass/style.sass'
import '../libs/select/select.css'
import SVG from 'svg.js'
import draggable from '../libs/draggable/draggable'
import resize from '../libs/resize/resize'
import select from '../libs/select/select.js'
import svgson from 'svgson'

// ------------------------------------------
// GLOBAL LIBS
// ------------------------------------------
draggable.call(this, SVG)
select.call(this, SVG)
resize.call(this, SVG)

// ------------------------------------------
// DRAW VARS
// ------------------------------------------

function giveMe(selector) {
  return document.querySelector(selector)
}
function giveMeAll(selector) {
  return document.querySelectorAll(selector)
}

const imgUrl = '/img/decor.svg'
let d = SVG('drawing').size(1440, 900).viewbox(0, 0, 1440, 900)
let pressed = false
let selectedElement = null
let btnAddTable = giveMe('.add-table')
let btnExport = giveMe('.export')
let btnAddText = giveMe('.add-text')
let btnAddLine = giveMe('.add-line')
let btnAddLine2 = giveMe('.add-bar')
let btnAddGlass = giveMe('.add-window')
let btnAddDecor = giveMe('.add-decor')
let btnClear = giveMe('.clear')

let tableCount = 1

let defs = {
  selectOptions: {pointSize: 5},
  selectOptionsLine: {pointSize: 15, deepSelect: true},
  selectClass: 'selected-element',
  dragOptions: {snapToGrid: 22},
  resizeOptions: {snapToGrid: 22, snapToAngle: 45},
  table: {
    x: 10,
    y: 10,
    width: 66,
    height: 66,
    radius: 4,
    fill: '#fff',
    text: {
      font: {
        size: '40px',
        fill: 'grey'
      },
      x: 10,
      y: 15
    }
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
      [60, 10]
    ],
    stroke: {
      width: 22,
      color: '#e1e5e6',
      linecap: 'round'
    },
    fill: 'none'
  },
  line2: {
    dots: [
      [10, 10],
      [60, 10]
    ],
    stroke: {
      width: 22,
      color: '#ebd7ce',
      linecap: 'round'
    },
    fill: 'none'
  },
  glass: {
    dots: [
      [10, 10],
      [60, 10]
    ],
    stroke: {
      color: '#84d4fb',
      width: 6,
      linecap: 'round',
      dasharray: '100 6'
    }
  }
}

// ------------------------------------------
// UI VARS
// ------------------------------------------

const menu = giveMe('.block-menu')
const copyBtn = giveMe('.copy-element')
const removeBtn = giveMe('.remove-element')

// ------------------------------------------
// DRAW FUNCTIONS
// ------------------------------------------

function selectElement (event, el) {
  event.stopPropagation()
  unselectAll(el)
  selectedElement = el
  el.draggable(defs.dragOptions)
  if (el.type === 'line')
    el.selectize(defs.selectOptionsLine).resize(defs.resizeOptions)
  else
    el.addClass(defs.selectClass)
  showMenu()
}

// Unselect all elements
function unselectAll () {
  selectedElement = null
  hideMenu()
  d.each(function (i) {
    this.selectize(false)
    if (this.hasClass(defs.selectClass)) this.removeClass(defs.selectClass)
  })
}

function fillWithPattern () {
  const pattern = d.pattern(22,22, add => {
    add.rect(22, 22).fill('#f5f7f7')
    add.circle(2).fill('#E1E5E6').move(10, 10)
  })
  d.rect('100%', '100%').fill(pattern)
}

// Creates new table
function createTable () {
  let group = d.group()
  let num = d.text(String(tableCount))
  .move(defs.table.text.x, defs.table.text.y)
  .font(defs.table.text.font)
  let table = d.rect(defs.table.width, defs.table.height)
  .fill(defs.table.fill)
  .radius(defs.table.radius)

  group.add(table).add(num).move(defs.table.x, defs.table.y).draggable(defs.dragOptions)

  tableCount++
  group.click(event => {
    selectElement(event, group)
  })
  group.touchstart(event => {
    selectElement(event, group)
  })
  // existElements.push(group)
}

// Creates new text block
function addText () {
  let text = prompt('Enter text')
  let textBlock = d.text(text).draggable(defs.dragOptions).font(defs.text.font)
  textBlock.click(event => {
    selectElement(event, textBlock)
  })
  textBlock.touchstart(event => {
    selectElement(event, textBlock)
  })
  // existElements.push(textBlock)
}

// Creates new line
function addLine () {
  let line = d.line(defs.line.dots).stroke(defs.line.stroke).draggable(defs.dragOptions)
  line.click(event => {
    selectElement(event, line)
  })
  line.touchstart(event => {
    selectElement(event, line)
  })
  // existElements.push(line)
}

// Creates new line2
function addLine2 () {
  let line = d.line(defs.line2.dots).stroke(defs.line2.stroke).draggable(defs.dragOptions)
  line.click(event => {
    selectElement(event, line)
  })
  line.touchstart(event => {
    selectElement(event, line)
  })
  // existElements.push(line)
}

// Creates new line-windows
function addGlass () {
  let line = d.line(defs.glass.dots).stroke(defs.glass.stroke).draggable(defs.dragOptions)
  line.click(event => {
    selectElement(event, line)
  })
  line.touchstart(event => {
    selectElement(event, line)
  })
  // existElements.push(line)
}

// Creates new decor element
function addDecor () {
  let decor = d.image(imgUrl).draggable(defs.dragOptions)
  decor.click(event => {
    selectElement(event, decor)
  })
  decor.touchstart(event => {
    selectElement(event, decor)
  })
}

// Copy selected element
function copyElement (event, el = selectedElement) {
  if (el) {
    let elNew = el.clone()
    elNew.draggable(defs.dragOptions).dmove(11, 11)
    elNew.click(event => {
      selectElement(event, elNew)
    })
    elNew.touchstart(event => {
      selectElement(event, elNew)
    })
    // existElements.push(elNew)
  }
}

// Removes selected element
function removeElement(event, el = selectedElement) {
  el.selectize(false)
  el.draggable(false)
  el.remove()
}

// Exports result SVG & JSON without selections
function exportSvg () {
  d.each(function () {
    this.draggable(false)
    this.selectize(false)
    this.resize(false)
    if (this.node.children[0] && this.node.children[0].classList.contains('svg_select_points')) this.remove()
  })

  svgson.parse(d.svg()).then(json => {
    window.postMessage(json)
    console.log(svgson.stringify(json))
  })
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
btnAddLine2.addEventListener('click', addLine2)
btnAddGlass.addEventListener('click', addGlass)
btnAddDecor.addEventListener('click', addDecor)
btnClear.addEventListener('click', () => {
  d.clear()
  fillWithPattern()
})

// ------------------------------------------
// DRAW ACTIONS
// ------------------------------------------
fillWithPattern()
d.on('click', event => {
  unselectAll(event)
})

// ------------------------------------------
// TEST
// ------------------------------------------
window.D = d