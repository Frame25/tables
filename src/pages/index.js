import 'normalize.css'
import '../sass/style.sass'
import '../libs/select/select.css'
import DrawingClass from '../components/drawing-class'
import React from 'react'
import ReactDOM from 'react-dom'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { CSSTransitionGroup } from 'react-transition-group'

import EditorMenu from '../components/editor-menu'
import ElementMenu from '../components/element-menu'
import ScaleMenu from '../components/scale-menu'


let ev = new Event('selectelement')

class Interface extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      D: new DrawingClass({ id: 'drawing', mode: 'edit', clickCallback: elem => { this.selectElement(elem) } }),
      selectedElement: null,
      editorMenu: true,
      elementMenu: false,
      scaleMenu: false
    }

    this.setEditorMenu = () => {
      this.setState({
        editorMenu: true,
        elementMenu: false,
        scaleMenu: false
      })
    }
    this.setElementMenu = () => {
      this.setState({
        editorMenu: false,
        elementMenu: true,
        scaleMenu: false
      })
    }
    this.setScaleMenu = () => {
      this.setState({
        editorMenu: false,
        elementMenu: false,
        scaleMenu: true
      })
    }
    this.selectElement = this.selectElement.bind(this)
  }

  selectElement (elem) {
    event.stopPropagation()
    // if (!this.state.selectedElement || elem.id() !== this.state.selectedElement.id()) {
    this.unselectAll()
    this.setState({selectedElement: elem})
    // select
    if (elem.type === 'line') elem.selectize(this.state.D.defs.selectOptionsLine).resize(this.state.D.defs.resizeOptions)
    else elem.addClass(this.state.D.defs.selectClass)

    // drag
    if (elem.type === 'line') elem.draggable(this.state.D.defs.dragOptions)
    else elem.draggable(this.state.D.defs.dragOptions2)

    this.setElementMenu()
    // }
    document.dispatchEvent(ev)
  }

  unselectAll () {
    let that = this
    this.state.D.svg.each(function () {
      this.selectize(false, {deepSelect: true}).resize(false)
      if (this.hasClass(that.state.D.defs.selectClass)) this.removeClass(that.state.D.defs.selectClass)
    })
  }

  componentDidMount () {
    if (!window.interface_listeners_set) {
      window.interface_listeners_set = true
      this.state.D.svg.click(() => {
        this.setEditorMenu()
        this.unselectAll()
      })
      this.state.D.fillWithPattern()
    }
    window.importData = map => {
      this.state.D.importData(map)
    }
  }

  render () {
    return (
      <CSSTransitionGroup
        transitionName="fade"
        transitionEnterTimeout={300}
        transitionLeaveTimeout={10}
        component="div"
      >
        {
          this.state.elementMenu ?
            <ElementMenu
              D={this.state.D}
              element={this.state.selectedElement}
              selectElement={this.selectElement}
              unselectAll={this.unselectAll}
              key="1"
            />
            : this.state.scaleMenu ?
            <ScaleMenu D={this.state.D} openEditorMenu={this.setEditorMenu} key="2" /> :
            <EditorMenu D={this.state.D} openScaleMenu={this.setScaleMenu} key="3" />
        }
      </CSSTransitionGroup>
    )
  }
}

ReactDOM.render(<Interface/>, document.getElementById('interface'))