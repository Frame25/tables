import 'normalize.css'
import '../sass/style.sass'

import SVG from 'svg.js'

// ------------------------------------------
// DEFAULTS
// ------------------------------------------
const defGrid = 22
const defY = defGrid * 15
const defX = defGrid * 22
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
    lineStartDots: [ [defX, defY], [xGrid(27), defY] ],
    table: {
        width: xGrid(3),
        widthB: xGrid(4),
        height: xGrid(3),
        radius: 8,
        fill: '#edf1f2',
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
// DRAWING
// ------------------------------------------

const d = SVG('drawing').size('100%', '100%').viewbox(0, 0, 1024, 768)

function clickEvent (el) {
    if (el.attr('restotype') === 'table') {
        let tables = document.querySelectorAll('.table')
        tables.forEach(table => {
            if (table.instance.hasClass('selected-table')) table.instance.removeClass('selected-table')
            if (table.instance.select('use').first().attr('href') === 'img/sofa-white.svg#sofaWhite') table.instance.select('use').first().attr('href', 'img/sofa-grey.svg#sofaGrey')
        })
        if (!el.hasClass('selected-table')) el.addClass('selected-table')
        el.select('use').first().attr('href', 'img/sofa-white.svg#sofaWhite')
        let data = JSON.stringify({
            number: el.select('.table-num').first().text(),
            guests: el.select('.guests-num').first().text()
        })
        console.log('table is clicked', data)
        window.postMessage(data)
    }
}

function clickRegister (el) {
    el.click(() => {
        clickEvent(el)
    })
    el.touchstart(() => {
        clickEvent(el)
    })
}

function addTable ({ guests = 2, number = 1, position = defs.startPos } = {}) {
    // params: { guests: Number, number: Number, position: Array(x, y) }

    let tableWidth = guests > 3 ? defs.table.widthB : defs.table.width
    let tableEl = d.group()
    let rect = d.rect(tableWidth, defs.table.height).fill(defs.table.fill).radius(defs.table.radius)
    let tableNum = d.text(String(number)).font(defs.table.numberFont).addClass('table-num').y(20).cx(tableWidth / 2)
    let guestsEl = d.group().y(9).x(tableWidth - 35)
    let sofa = d.use('sofaGrey', 'img/sofa-grey.svg').y(0).x(0)
    let guestsNum = d.text(String(guests)).font(defs.table.guestsFont).addClass('guests-num').y(-5).x(20)

    guestsEl.add(sofa).add(guestsNum)
    tableEl.add(rect).add(tableNum).add(guestsEl).move(...position).addClass('table').attr('restotype', 'table')
    
    clickRegister(tableEl)
}

function addText ({ text = 'Text', position = defs.startPos } = {}) {
    // params: { text: String, position: Array(x, y) }
    let textBlock = d.text(text)
        .font(defs.textFont)
        .move(...position)

    // clickRegister(textBlock)
}

function addWall ({ dots = defs.lineStartDots } = {}) {
    // params: { dots: Array( Array(x, y), Array(x, y) ) }
    let wall = d.line(dots).stroke(defs.wallStroke).attr('restotype', 'wall')
    // clickRegister(wall)
}

function addBar ({ dots = defs.lineStartDots } = {}) {
    // params: { dots: Array( Array(x, y), Array(x, y) ) }
    let bar = d.line(dots).stroke(defs.barStroke).attr('restotype', 'bar')
    // clickRegister(bar)
}

function addGlass ({ dots = defs.lineStartDots } = {}) {
    // params: { dots: Array( Array(x, y), Array(x, y) ) }
    let glass = d.line(dots).stroke(defs.glassStroke).attr('restotype', 'window')
    // clickRegister(glass)
}

function addBarnchair ({ position = defs.startPos } = {}) {
    // params: { position: Array(x, y) }
    let decor = d.image('img/barnchair.svg').move(...position).attr('restotype', 'barnchair')
    // clickRegister(decor)
}

function addDecor ({ position = defs.startPos } = {}) {
    // params: { position: Array(x, y) }
    let decor = d.image('img/decor.svg').move(...position).attr('restotype', 'decor')
    // clickRegister(decor)
}

function addDecor2 ({ position = defs.startPos } = {}) {
    // params: { position: Array(x, y) }
    let decor = d.image('img/decor2.svg').move(...position).attr('restotype', 'decor2')
    // clickRegister(decor)
}

function addDecorMulti ({ position = defs.startPos, type = 'decor' } = {}) {
    // params: { position: Array(x, y) }
    if (type !== 'decor' && type !== 'decor2' && type !== 'barnchair') {
        throw new Error('unregistered type of decor')
        return false
    }
    let decor = d.image('img/' + type + '.svg').move(...position).attr('restotype', type)
    // clickRegister(decor)
}

// ----------- IMPORT -->
function importData (map) {
    if (map) {
        let json = typeof map === 'string' ? JSON.parse(map) : map
        d.viewbox(0, 0, json.width, json.height)
        if (json.elements && json.elements.length) {
            json.elements.forEach(el => {
                switch (el.type) {
                    case 'table':
                        addTable({
                            position: [el.x, el.y],
                            number: el.number,
                            guests: el.guests
                        })
                        break
                    case 'text':
                        addText({
                            text: el.text,
                            position: [el.x, el.y],
                        })
                        break
                    case 'wall':
                        addWall({
                            dots: el.dots
                        })
                        break
                    case 'bar':
                        addBar({
                            dots: el.dots
                        })
                        break
                    case 'window':
                        addGlass({
                            dots: el.dots
                        })
                        break
                    case 'decor':
                        addDecor({
                            position: [el.x, el.y]
                        })
                        break
                    case 'decor2':
                        addDecor2({
                            position: [el.x, el.y]
                        })
                        break
                    case 'barnchair':
                        addBarnchair({
                            position: [el.x, el.y]
                        })
                        break

                }
            })
        }
    }
}

window.importData = importData