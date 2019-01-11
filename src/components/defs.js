const defGrid = 22
const defY = xGrid(22)
const defX = xGrid(22)
function xGrid (num = 1) {
  return defGrid * parseFloat(num)
}

export default {
  grid: defGrid,
  xGrid: xGrid,
  selectOptionsLine: {pointSize: defGrid, rotationPoint: false, deepSelect: true},
  selectClass: 'selected-element',
  dragOptions: {snapToGrid: defGrid / 2},
  dragOptions2: {snapToGrid: defGrid},
  resizeOptions: {snapToGrid: defGrid / 2, snapToAngle: 45},
  startPos: [defX, defY],
  lineStartDots: [ [defX, defY], [xGrid(27), defY] ],
  viewbox: {
    width: 1024,
    height: 600
  },
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
    color: '#edf1f2',
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
