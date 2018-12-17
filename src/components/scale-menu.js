import React, {Component} from 'react'

export default class ScaleMenu extends Component {
    constructor (props) {
        super(props)
    }

    render () {
        return (
            <div className="scale-menu">
                <div className="interface__text">Рабочая область</div>
                <div className="interface__btn right-plus" onClick={() => this.props.D.changeScale({dx: 3})}>
                    <div className="btn__icon icon-right-plus"></div>
                    <div className="btn__text">Добавить справа</div>
                </div>
                <div className="interface__btn right-minus" onClick={() => this.props.D.changeScale({dx: -3})}>
                    <div className="btn__icon icon-right-minus"></div>
                    <div className="btn__text">Убрать справа</div>
                </div>
                <div className="interface__btn bottom-plus" onClick={() => this.props.D.changeScale({dy: 3})}>
                    <div className="btn__icon icon-bottom-plus"></div>
                    <div className="btn__text">Добавить снизу</div>
                </div>
                <div className="interface__btn bottom-minus" onClick={() => this.props.D.changeScale({dy: -3})}>
                    <div className="btn__icon icon-bottom-minus"></div>
                    <div className="btn__text">Убрать снизу</div>
                </div>
                <div className="interface__btn" onClick={() => this.props.openEditorMenu()}>
                    <div className="text-btn">Готово</div>
                </div>
            </div>
        )
    }
}