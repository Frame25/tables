import 'normalize.css'
import '../sass/style.sass'
import '../libs/select/select.css'
import DrawingClass from '../components/drawing-class'
import React from 'react'
import ReactDOM from 'react-dom'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import EditorMenu from '../components/editor-menu'
import ElementMenu from '../components/element-menu'
import ScaleMenu from '../components/scale-menu'

class Interface extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            D: new DrawingClass({ id: 'drawing', mode: 'edit', clickCallback: this.clickCallback.bind(this) }),
            selectedElement: null,
            selectedText: null,
            selectedGuests: null,

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
        this.setSelectedElement = (el) => {
            this.setState({selectedElement: el})
        }
        this.setSelectedText = (el) => {
            this.setState({selectedText: el})
        }
        this.setSelectedGuests = (el) => {
            this.setState({selectedGuests: el})
        }
    }

    clickCallback (el) {
        this.selectElement(el)
    }

    selectElement (elem) {
        event.stopPropagation()
        this.unselectAll()
        this.setSelectedElement(elem)

        // select
        if (elem.type === 'line') elem.selectize(this.state.D.defs.selectOptionsLine).resize(this.state.D.defs.resizeOptions)
        else elem.addClass(this.state.D.defs.selectClass)

        // selected element text
        if (elem.attr().restotype === 'table') {
            this.state.selectedText = elem.select('.table-num').first().text()
            this.state.selectedGuests = elem.select('.guests-num').first().text()
        }
        if (elem.type === 'text') this.state.selectedText = elem.text()

        // drag
        if (elem.type === 'line') elem.draggable(this.state.D.defs.dragOptions)
        else elem.draggable(this.state.D.defs.dragOptions2)

        this.setElementMenu()
    }

    unselectAll () {
        this.setEditorMenu()
        this.setSelectedElement(null)

        let that = this
        this.state.D.svg.each(function () {
            this.selectize(false, {deepSelect: true}).resize(false)
            if (this.hasClass(that.state.D.defs.selectClass)) this.removeClass(that.state.D.defs.selectClass)
        })
    }

    parentCallback (callback) {
        let that = this
        callback(that)
    }

    componentDidMount () {
        window.D = this.state.D
        this.state.D.svg.click(() => {
            this.unselectAll()
        })
        this.state.D.fillWithPattern()
    }

    render () {
        return (
            <ReactCSSTransitionGroup
                transitionName="fade"
                transitionEnterTimeout={300}
                transitionLeaveTimeout={300}
                >
                {
                    this.state.elementMenu ?
                        <ElementMenu
                            D={this.state.D}
                            element={this.state.selectedElement}
                            selectedText={this.state.selectedText}
                            selectedGuests={this.state.selectedGuests}
                            selectElement={this.selectElement.bind(this)}
                            unselectAll={this.unselectAll.bind(this)}
                            setText={this.setSelectedText}
                            setEl={this.setSelectedElement}
                            setGuests={this.setSelectedGuests}
                            parentCallback={this.parentCallback.bind(this)}
                            key="1"
                        />
                        : this.state.scaleMenu ?
                        <ScaleMenu D={this.state.D} openEditorMenu={this.setEditorMenu} key="2" /> :
                        <EditorMenu D={this.state.D} openScaleMenu={this.setScaleMenu} key="3" />
                }
            </ReactCSSTransitionGroup>
        )
    }
}

ReactDOM.render(<Interface/>, document.getElementById('interface'))