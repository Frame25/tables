import 'normalize.css'
import '../sass/style.sass'
import DrawingClass from '../components/drawing-class'
// import React from 'react'
// import ReactDOM from 'react-dom'

// ------------------------------------------
// DRAWING
// ------------------------------------------

const d = new DrawingClass({ id: 'drawing', mode: 'view', clickCallback: clickEvent })

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

window.importData = (map) => {
    d.importData(map)
}