import React, {Component} from 'react'

export default class ElementMenu extends Component {
  constructor (props) {
    super(props)
    this.state = {
      txt: '',
      gst: ''
    }
  }

  copyElement () {
    if (this.props.element) {
      let elNew = this.props.element.clone()
      elNew.draggable(this.props.D.defs.dragOptions).dmove(this.props.D.defs.xGrid(2), this.props.D.defs.xGrid(2))
      this.props.D.registerClickCallback(elNew)
      if (elNew.attr().restotype === 'table') {
        this.changeText({element: elNew, text: String(this.props.D.tableNum)})
      }
      this.props.selectElement(elNew)
    }
  }

  removeElement() {
    if (this.props.element) {
      this.props.element.selectize(false, {deepSelect: true})
        .resize(false)
        .draggable(false)
        .remove()
      this.props.unselectAll()
    }
  }

  rotateElement (side = 'right') {
    if (this.props.element) {
      let rotate = this.props.element.transform().rotation
      side === 'left' ? rotate -= 90 : rotate += 90
      this.props.element.transform({ rotation: rotate })
    }
  }

  changeText ({event = event || window.event, element = this.props.element, text = null} = {}) {
    text = text || event.target.value
    if (element && element.type === 'text') {
      this.setState({txt: text})
      if (text === '') text = 'Текст'
      element.text(text)
    } else if (element && element.select('.table-num').length()) {
      this.setState({txt: text})
      if (text === '') text = '00'
      text = text.slice(0,2)
      let w = element.select('rect').first().width()
      element.select('.table-num').first().text(text).cx(w / 2)
    }
  }

  changeGuestNum (event) {
    let text = event.target.value
    if (this.props.element && this.props.element.select('.guests-num').length()) {
      this.setState({gst: text})
      if (text === '') text = '1'
      text = text.slice(0,1)
      this.props.element.select('.guests-num').first().text(text)
    }
  }

  componentDidMount() {
    document.addEventListener('selectelement', () => {
      this.setState({
        txt: this.props.element.text() || this.props.element.select('.table-num').first().text(),
        gst: this.props.element.select('.guests-num').first().text() || ''
      })
    })
  }

  render () {
    return (
      <div className="element-menu">
        {this.props.element.attr('restotype') === 'table' &&
        <div className="interface__input table-number"><span>Номер стола</span>
          <input type="text" value={this.state.txt} onChange={this.changeText.bind(this)} />
        </div>
        }
        {this.props.element.attr('restotype') === 'table' &&
        <div className="interface__input table-guests"><span>Кол. гостей</span>
          <input type="text" value={this.state.gst} onChange={this.changeGuestNum.bind(this)} />
        </div>
        }
        {this.props.element.type === 'text' &&
        <div className="interface__input table-number wide"><span>Текст</span>
          <input type="text" value={this.state.txt} onChange={this.changeText.bind(this)} />
        </div>
        }
        {this.props.element.type === 'line' &&
        <div className="interface__btn rotate-left" onClick={this.rotateElement.bind(this, 'left')}>
          <div className="btn__icon icon-rotate"></div>
          <div className="btn__text">Повернуть влево</div>
        </div>
        }
        {this.props.element.type === 'line' &&
        <div className="interface__btn rotate-right" onClick={this.rotateElement.bind(this)}>
          <div className="btn__icon icon-rotate right"></div>
          <div className="btn__text">Повернуть вправо</div>
        </div>
        }
        <div className="interface__btn copy-element" onClick={this.copyElement.bind(this)}>
          <div className="btn__icon icon-copy"></div>
          <div className="btn__text">Дублировать</div>
        </div>
        <div className="interface__btn remove-element" onClick={this.removeElement.bind(this)}>
          <div className="btn__icon icon-remove"></div>
          <div className="btn__text">Удалить</div>
        </div>
      </div>
    )
  }


}