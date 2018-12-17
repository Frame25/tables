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
import defs from './defs.js'

// ------------------------------------------
// DRAWING CLASS
// ------------------------------------------

function defCallback () { console.log('click callback') }

let sw = window.screen.width
let small = sw <= 768
if (small) {
  window.addEventListener('load', () => {document.querySelector('svg').parentNode.scrollTo(defs.xGrid(15), defs.xGrid(15))})
}

export default class Drawing {
  constructor ({
                 id = 'drawing',
                 mode = 'view',
                 clickCallback = defCallback
               } = {}) {
    this.defs = defs
    this.mode = mode
    this.clickCallback = clickCallback
    this.svg = SVG(id).size(small ? defs.viewbox.width : '100%', small ? defs.viewbox.height : '100%').viewbox(0, 0, defs.viewbox.width, defs.viewbox.height)
    // this._tableCount = 1
    this._tableNum = 0
    this.pattern = this.svg.pattern(22, 22, add => {
      add.rect(22, 22).fill('#ffffff')
      add.circle(2).fill('#C8CBCC')
    })
    this.patternRect = this.svg.rect(100, 100).fill('none')
  }

  get tableNum () {
    this._tableNum++
    return this._tableNum
  }
  set tableNum (val) {
    this._tableNum = val
  }

  // DRAW METHODS

  fillWithPattern () {
    let sizes = this.svg.viewbox()
    this.patternRect.width(sizes.width).height(sizes.height).fill(this.pattern)
  }

  registerClickCallback (el) {
    if ('ontouchstart' in window) {
      el.touchstart(() => {
        this.clickCallback(el)
      })
    } else {
      el.click(() => {
        this.clickCallback(el)
      })
    }
  }

  addTable ({ guests = 2, number = null, position = defs.startPos, transform = null } = {}) {
    // params: { guests: Number, number: Number, position: Array(x, y) }

    let tableWidth = guests > 3 ? defs.table.widthB : defs.table.width
    let tableEl = this.svg.group()
    let rect = this.svg.rect(tableWidth, defs.table.height).fill(defs.table.fill).radius(defs.table.radius)
    let tableNum = this.svg.text(String(number || this.tableNum)).font(defs.table.numberFont).addClass('table-num').y(20).cx(tableWidth / 2)
    let guestsEl = this.svg.group().y(9).x(tableWidth - 35)
    let sofa = this.svg.use('sofaGrey', 'img/sofa-grey.svg').y(0).x(0)
    let guestsNum = this.svg.text(String(guests)).font(defs.table.guestsFont).addClass('guests-num').y(-5).x(20)

    guestsEl.add(sofa).add(guestsNum)
    tableEl.add(rect).add(tableNum).add(guestsEl).move(...position).addClass('table').attr('restotype', 'table')

    if (this.mode === 'edit') tableEl.draggable(defs.dragOptions2)
    if (transform) tableEl.transform(transform)

    this.registerClickCallback(tableEl)
  }

  addText ({ text = 'Текст', position = defs.startPos, transform = null } = {}) {
    // params: { text: String, position: Array(x, y) }
    let textBlock = this.svg.text(text)
      .font(defs.textFont)
      .move(...position)
    if (this.mode === 'edit') textBlock.draggable(defs.dragOptions2)
    if (transform) line.transform(transform)

    this.registerClickCallback(textBlock)
  }

  addLine ({ dots = defs.lineStartDots, type = 'wall', transform = null } = {}) {
    // params: { dots: Array( Array(x, y), Array(x, y) ), type: 'wall' || 'bar' || 'glass' }
    if (type !== 'wall' && type !== 'bar' && type !== 'glass') {
      throw new Error('unregistered type of line')
      return false
    }
    let line = this.svg.line(dots).stroke(defs[type + 'Stroke']).attr('restotype', type)
    if (this.mode === 'edit') line.draggable(defs.dragOptions)
    if (transform) line.transform(transform)

    this.registerClickCallback(line)
  }

  addDecor ({ position = defs.startPos, type = 'decor', transform = null } = {}) {
    // params: { position: Array(x, y), type: 'decor' || 'decor2' || 'barnchair' }
    if (type !== 'decor' && type !== 'decor2' && type !== 'barnchair') {
      throw new Error('unregistered type of decor')
      return false
    }
    let decor = this.svg.image('img/' + type + '.png', ( type === 'decor2' ? defs.xGrid(4) : defs.xGrid(3) ), defs.xGrid(3)).move(...position).attr('restotype', type)
    if (this.mode === 'edit') decor.draggable(defs.dragOptions)
    if (transform) decor.transform(transform)

    this.registerClickCallback(decor)
  }

  changeScale ({dx = 0, dy = 0} = {}) {
    let width = this.svg.viewbox().width + defs.xGrid(dx)
    let height = this.svg.viewbox().height + defs.xGrid(dy)

    if (width < defs.viewbox.width) width = defs.viewbox.width
    if (height < defs.viewbox.height) height = defs.viewbox.height

    this.svg.viewbox(0, 0, width, height)
    if (this.mode === 'edit') this.fillWithPattern()
  }

  clearAll () {
    this.svg.clear()
    this.pattern = this.svg.pattern(22, 22, add => {
      add.rect(22, 22).fill('#ffffff')
      add.circle(2).fill('#C8CBCC')
    })
    this.patternRect = this.svg.rect(100, 100).fill('none')
    if (this.mode === 'edit') this.fillWithPattern()
  }

  // EXPORTING / IMPORTING

  exportData () {
    let expData = {
      uuid: '',
      width: this.svg.viewbox().width,
      height: this.svg.viewbox().height,
      elements: []
    }

    this.svg.each(function () {
      this.draggable(false)
        .selectize(false, {deepSelect: true})
        .resize(false)

      this.draggable(false).selectize(false, {deepSelect: true}).resize(false)
      if (this.hasClass(defs.selectClass)) this.removeClass(defs.selectClass)

      let type = this.attr('restotype')
      switch (type) {
        case 'table':
          expData.elements.push({
            type,
            x: this.x(),
            y: this.y(),
            number: this.select('.table-num').first().text(),
            guests: this.select('.guests-num').first().text(),
            transform: this.transform()
          })
          break
        case 'text':
          expData.elements.push({
            type,
            x: this.x(),
            y: this.y(),
            text: this.text(),
            transform: this.transform()
          })
          break
        case 'wall':
          expData.elements.push({
            type,
            dots: this.array().value,
            transform: this.transform()
          })
          break
        case 'bar':
          expData.elements.push({
            type,
            dots: this.array().value,
            transform: this.transform()
          })
          break
        case 'glass':
          expData.elements.push({
            type,
            dots: this.array().value,
            transform: this.transform()
          })
          break
        case 'decor':
          expData.elements.push({
            type,
            x: this.x(),
            y: this.y(),
            transform: this.transform()
          })
          break
        case 'decor2':
          expData.elements.push({
            type,
            x: this.x(),
            y: this.y(),
            transform: this.transform()
          })
          break
        case 'barnchair':
          expData.elements.push({
            type,
            x: this.x(),
            y: this.y(),
            transform: this.transform()
          })
          break

      }
    })
    window.localStorage.setItem('restoclub_last_map', JSON.stringify(expData))
    console.log(JSON.stringify(expData))
    window.postMessage(JSON.stringify(expData))
  }

  importData (map) {
    if (map) {
      let json = typeof map === 'string' ? JSON.parse(map) : map
      this.svg.viewbox(0, 0, json.width, json.height)
      if (json.elements && json.elements.length) {
        json.elements.forEach(el => {
          switch (el.type) {
            case 'table':
              this.addTable({
                position: [el.x, el.y],
                number: el.number,
                guests: el.guests,
                transform: el.transform
              })
              break
            case 'text':
              this.addText({
                text: el.text,
                position: [el.x, el.y],
                transform: el.transform
              })
              break
            case 'wall':
              this.addLine({
                type: 'wall',
                dots: el.dots,
                transform: el.transform
              })
              break
            case 'bar':
              this.addLine({
                type: 'bar',
                dots: el.dots,
                transform: el.transform
              })
              break
            case 'glass':
              this.addLine({
                type: 'glass',
                dots: el.dots,
                transform: el.transform
              })
              break
            case 'decor':
              this.addDecor({
                type: 'decor',
                position: [el.x, el.y],
                transform: el.transform
              })
              break
            case 'decor2':
              this.addDecor({
                type: 'decor2',
                position: [el.x, el.y],
                transform: el.transform
              })
              break
            case 'barnchair':
              this.addDecor({
                type: 'barnchair',
                position: [el.x, el.y],
                transform: el.transform
              })
              break

          }
        })
      }
    }
  }
}

